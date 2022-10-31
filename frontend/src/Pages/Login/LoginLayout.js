import React from 'react'
import './login.css';
//import Cookies from "js-cookie";



function LoginLayout({children,header=''}){
 
  return(
    <div className='backgroundimg'>
      <br/><br/><br/>
      <div id='loginForm' className=' midDiv' >
        <div >
        <h1 className='flex-20 signTitle'>{header}</h1>
          <div id='content' className=' d-flex flex-column center flex-80 h100'> 
            <div className='d-flex flex-column h100'>  
              {children}
            </div>
          </div>
        </div>
          </div>
    </div>

    
  )

}

export default LoginLayout