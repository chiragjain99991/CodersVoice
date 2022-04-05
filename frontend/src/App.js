
import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Home from './pages/Home/Home';
import Navbar from './components/share/Navigation/Navbar';
import Loader from './components/share/Loader/Loader.jsx';


import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Room from './pages/Rooms/Room'
import SingleRoom from './pages/SingleRoom/SingleRoom';

import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';

function App() {
    
    const { loading } = useLoadingWithRefresh();
    
    
    return loading ? (
        <Loader message="Loading, Please Wait"/>
        ) : (
    <BrowserRouter>
        <Navbar/>
        <Switch>
            <GuestRoute path="/" exact>
                <Home />
            </GuestRoute>
            
            <GuestRoute path="/authenticate" exact>
                    <Authenticate />
            </GuestRoute>

            <SemiProtectedRoute path='/activate'>
                    <Activate/>
            </SemiProtectedRoute>
            <ProtectedRoute path='/rooms'>
                <Room/>
            </ProtectedRoute>
            <ProtectedRoute path='/room/:id'>
                <SingleRoom/>
            </ProtectedRoute>

            
            
        </Switch>
    </BrowserRouter>
    );
}


const GuestRoute = ({children,...rest}) => {

    const auth = useSelector((state)=>state.auth)
    const { isAuth } = auth


    return (
        <Route {...rest}
        render ={({location})=>{
            return isAuth ? 
           ( <Redirect to={{
                pathname:'/rooms',
                state: { from: location}
            }} />
            ) : (
                children
            )
            
        }}
        >

        </Route>
    )
}

const SemiProtectedRoute = ({children,...rest}) => {

    const auth = useSelector((state)=>state.auth)
    const { isAuth, user } = auth

    return (
        <Route {...rest}
        render={({location})=>{
            return (!isAuth ? (
                <Redirect to={{
                    pathname:'/',
                    state: { from: location}
                }} />
            ) : isAuth && !user.activated ? 
            ( children ) : (
                <Redirect to={{
                    pathname:'/rooms',
                    state: { from: location}
                }} />
            )
        )
        }}
        >

        </Route>
    )
}


const ProtectedRoute = ({children,...rest}) => {


    const auth = useSelector((state)=>state.auth)
    const { isAuth, user } = auth

    
    return (
        <Route {...rest}
        render={({location})=>{
            return (!isAuth ? (
                <Redirect to={{
                    pathname:'/',
                    state: { from: location}
                }} />
            ) : isAuth && !user.activated ? 
            ( 
                <Redirect to={{
                    pathname:'/activate',
                    state: { from: location}
                }} />
             ) : (
               (children)
            )
        )
        }}
        >

        </Route>
    )
}

export default App;
