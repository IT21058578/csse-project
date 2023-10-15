import {useEffect} from 'react'
import {Navigate, useNavigate} from "react-router-dom"
import { LoginForm } from '../components/Form';
import RoutePaths from '../config';
import { checkLogin } from '../Utils/Generals';
import SignInSide from './LoginScreen';

const Login = () => {

  return (
    <>
      <SignInSide/>
    </>
  )
}

export default Login;
