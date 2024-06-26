/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import Image from "next/image"
import React, { useEffect, useState } from "react"

const SignUpBtn = ({ src, hoverSrc, mobileSrc, setShowSignUpForm }) => {
  const [btnStyle, setBtnStyle] = useState("default")

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBtnStyle("default")
      } else {
        setBtnStyle("mobile")
      }
    }
    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mobileSrc, src])

  return (
    <div className="relative sign-up-btn w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden">
      <button
        type="button"
        onMouseOut={() => {
          setBtnStyle(window.innerWidth >= 768 ? "default" : "mobile")
        }}
        onMouseOver={() => {
          setBtnStyle("hover")
        }}
        onMouseDown={() => {
          setShowSignUpForm(true)
        }}
        className="hover:cursor-signup w-full h-full btn-sign--up"
      >
        <div
          className={`${btnStyle !== "default" ? "hidden" : ""} bg-no-repeat`}
        >
          <Image
            className="scale-[1.05] origin-center"
            unoptimized
            loading="eager"
            src={src}
            layout="fill"
            alt="Sign up for GymTonic"
          />
        </div>
        <div
          className={`${btnStyle !== "mobile" ? "hidden" : ""} bg-no-repeat`}
        >
          <Image
            className="scale-[1.05] origin-center"
            unoptimized
            loading="eager"
            src={mobileSrc}
            layout="fill"
            alt="Sign up for GymTonic"
          />
        </div>
        <div className={`${btnStyle !== "hover" ? "hidden" : ""} bg-no-repeat`}>
          <Image
            className="scale-[1.05] origin-center"
            loading="eager"
            unoptimized
            src={hoverSrc}
            layout="fill"
            alt="Sign up for GymTonic"
          />
        </div>
      </button>
    </div>
  )
}

export default SignUpBtn
