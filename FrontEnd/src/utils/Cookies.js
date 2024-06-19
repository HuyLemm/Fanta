import { Navigate, useNavigate } from 'react-router-dom';

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/public/check-role', {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return {
          loggedIn: true,
          role: data.role,
          avatar: data.avatar, // Add avatar to the response
        };
      } else {
        return {
          loggedIn: false,
          role: null,
          avatar: null,
        };
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      return {
        loggedIn: false,
        role: null,
        avatar: null,
      };
    }
  };
  

  
  export { setCookie, getCookie, checkLoginStatus}