import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Table, Tag, Space } from 'antd';
import {CloudDownloadOutlined,ToolOutlined} from '@ant-design/icons';
import AppLayout from  '../../AppLayout';
import '../../App.css'
import {Dropdown,DropdownButton} from 'react-bootstrap';



class Summary extends React.Component {
  constructor(props) {
    super(props)    
    this.state = {   
     
      }
    }
 
   

    render() {
      let session = JSON.parse(Cookies.get("session"))
    var user = session.user
      const app = this.state.appDetails
      return(
          <div>
              <AppLayout>
                <div style={{display:'flex'}}>
                  <div style ={{float : 'left',width:'20%'}}>
                    <img style = {{ height:'100px'}} src ={require('../../images/icons/account-profile.png').default}></img>
                  <div >
                    Name: Student<br/>
                    Email: student@gmail.com
                  </div>
                  </div>
                  
                  </div>
              </AppLayout>
          </div>
      );
    }
  }

  export default Summary;