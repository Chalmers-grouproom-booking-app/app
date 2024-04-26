import * as React from "react"
import Svg, { Path } from "react-native-svg"

function GreenCheckmark(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
      <Path
        d="M32 2C15.431 2 2 15.432 2 32c0 16.568 13.432 30 30 30 16.568 0 30-13.432 30-30C62 15.432 48.568 2 32 2zm-6.975 48l-.02-.02-.017.02L11 35.6l7.029-7.164 6.977 7.184 21-21.619L53 21.199 25.025 50z"
        fill="#43a047"
      />
    </Svg>
  )
}

export default GreenCheckmark
