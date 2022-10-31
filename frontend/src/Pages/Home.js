import React from "react";
import GradOfficerHome from './GradOfficer/GradOfficerHome';
import StudentHome from './Application/StudentHome';
import Cookies from "js-cookie";

class Home extends React.Component{
    
    render(){
        const session = JSON.parse(Cookies.get("session"));
        const role  = session.user.role;
        console.log('inside home js ', role)
        document.title = "Home"
        return(<div>
            {(role === 'student') && <StudentHome/>}
            {(role === 'admin') && <GradOfficerHome/>}
        </div>)
    }
}

export default Home;