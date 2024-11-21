import MyPage from "./MyPage";
import { BackgroundGradient } from '../components/BackgroundGradient'
import React, { useEffect, useState } from 'react'

function index() {

  const [error, setError] = useState(2)

  const [color, setColor] = useState<'blue' | 'green' | 'red'| 'purple'>('blue')

  useEffect(() => {
    if (error === 1) {
      setColor('green')
      setTimeout(() => {
        setError(2)
      }, 5000)
    } else if (error === 0) {
      setColor('red')
      setTimeout(() => {
        setError(2)
      }, 5000)
    } else if (error === 2) {
      setColor('blue')
    }
    else {
        setColor('purple')
    }
  }, [error])

  return (
    <div>
        <BackgroundGradient className="bg-cta-background rounded-2xl" color={color}>
            <MyPage setError={setError} />
        </BackgroundGradient>
    </div>
  )
}

export default index