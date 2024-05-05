/* eslint-disable react/prop-types */
import * as React from 'react'
import { calculateProgress, sendProgressToServer } from '../utils/helpers'
import gameBoardContext from './gameBoardContext'

const recordReducer = (state, action) => {
  switch (action.type) {
    case 'CORRECT': {
      if (state.completed.length > action.payload.nextPointer) {
        return {
          ...state,
          inputText: state.inputText.concat(action.payload.letter),
        }
      }

      return {
        ...state,
        completed: state.completed.concat(action.payload.letter),
        inputText: state.inputText.concat(action.payload.letter),
      }
    }
    case 'INCORRECT': {
      return {
        ...state,
        inputText: state.inputText.concat(action.payload.letter),
      }
    }
    case 'CLEAR': {
      return {
        ...state,
        inputText: action.payload.inputText,
      }
    }
  }
}

// const phrase =
//   'High in the mountains, where the air is crisp and the silence profound, a lone eagle soared gracefully against the azure sky.'

const GameBoard = ({ onRecord }) => {
  const [nextPointer, setNextPointer] = React.useState(0)
  const [inputValue, setInputValue] = React.useState('')
  const [hasTypoAtNextPointer, setHasTypoAtNextPointer] = React.useState(false)
  const thresold = 10
  const completedPartOfThePhrase = React.useRef('')
  const { roomId, socket, beginRacing, handleBeginRacing, onGameOver, phrase } =
    React.useContext(gameBoardContext)
  const inputRef = React.useRef(null)
  const [state, dispatch] = React.useReducer(recordReducer, {
    completed: '',
    inputText: '',
  })
  // const [time, setTime] = React.useState(0)
  const timeRef = React.useRef(0)

  const totalWordsLength = phrase.split(' ').length

  // console.log({ completedPartOfThePhrase, nextPointer, inputValue })

  React.useEffect(() => {
    let intervalId
    if (beginRacing && inputRef.current) {
      inputRef.current.focus()
      intervalId = setInterval(() => {
        timeRef.current = timeRef.current + 50
      }, 50)
    } else {
      inputRef.current.blur()
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [beginRacing])

  // const onRecordSend = React.useEffectEvent((state, onRecord) => {
  //   onRecord(time, state.completed, state.inputText)
  // })

  React.useEffect(() => {
    onRecord(timeRef.current, state.completed, state.inputText)
  }, [state, onRecord])

  const handleChange = (e) => {
    const value = e.target.value

    if (
      // if the user types the next character and till there is no typo
      completedPartOfThePhrase.current.length + value.length > nextPointer &&
      !hasTypoAtNextPointer
    ) {
      // a typo occured
      // onRecord()
      if (value[value.length - 1] !== phrase[nextPointer]) {
        setHasTypoAtNextPointer(true)
        dispatch({
          type: 'INCORRECT',
          payload: { letter: value[value.length - 1] },
        })

        if (value.length <= thresold) {
          setInputValue(value)
        }
        return
      } else {
        // no typo
        // onRecord()
        // check if the next character is the last character of the whole phrase
        dispatch({
          type: 'CORRECT',
          payload: { letter: value[value.length - 1], nextPointer },
        })
        if (
          nextPointer === phrase.length - 1 &&
          value[value.length - 1] === phrase[nextPointer]
        ) {
          completedPartOfThePhrase.current =
            completedPartOfThePhrase.current.concat(value)
          setInputValue('')
          handleBeginRacing(false)
          sendProgressToServer(socket, roomId, 100)
          onGameOver(true)
        } else if (phrase[nextPointer] === ' ') {
          // check if the next character is a space
          completedPartOfThePhrase.current =
            completedPartOfThePhrase.current.concat(value)
          setInputValue('')
          // emit a socket event to the server
          console.log('socket', socket)
          // socket.emit('send-progress', 'kci22ar', 10)
          const typedWordsLength =
            completedPartOfThePhrase.current.split(' ').length - 1
          const progress = calculateProgress(typedWordsLength, totalWordsLength)
          console.log({ progress })
          sendProgressToServer(socket, roomId, progress)
        } else {
          setInputValue(value)
        }
        setNextPointer(nextPointer + 1)
      }
    } else if (
      // if the user deletes characters from the input
      completedPartOfThePhrase.current.length + value.length <=
      nextPointer
    ) {
      setHasTypoAtNextPointer(false)
      setInputValue(value)
      setNextPointer(value.length + completedPartOfThePhrase.current.length)
      dispatch({
        type: 'CLEAR',
        payload: { inputText: completedPartOfThePhrase.current + value },
      })
    } else if (hasTypoAtNextPointer && value.length <= thresold) {
      setInputValue(value)
      dispatch({
        type: 'INCORRECT',
        payload: { letter: value[value.length - 1] },
      })
    }
  }

  return (
    <div className='py-4'>
      <div>
        {phrase.split('').map((letter, index) => {
          let classlist = 'decoration-purple-500 underline-offset-1' // default

          // underline on the next character
          if (index === nextPointer) {
            classlist = classlist.concat(' underline')
          }

          // show error on the character
          if (
            index >= nextPointer &&
            index <
              inputValue.length + completedPartOfThePhrase.current.length &&
            hasTypoAtNextPointer
          ) {
            classlist = classlist.concat(' bg-red-400 text-white')
          }

          // text color green on completed characters
          if (index < nextPointer) {
            classlist = classlist.concat(' text-green-700')
          }

          return (
            <span key={index} className={classlist}>
              {letter}
            </span>
          )
        })}
      </div>
      <input
        type='text'
        ref={inputRef}
        value={inputValue}
        disabled={beginRacing ? false : true}
        onChange={handleChange}
        className='border-2 border-purple-500 rounded-md w-full mt-8 p-2 text-2xl outline-purple-500'
      />
    </div>
  )
}

export default GameBoard
