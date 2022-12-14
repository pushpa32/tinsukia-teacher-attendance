import React, { useEffect } from 'react'
import error404 from "../images/error1.jpg"

function Error404() {

  useEffect(() => {
    window.location.href = "/"
  })
  return (
    <center>
      <div>
        <img src={error404} style={{ width: "100%", height: "100vh" }} alt="" />
      </div>
    </center>
  )
}

export default Error404