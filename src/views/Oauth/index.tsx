import React from 'react';
import { useMount } from "ahooks";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { useSelector, useDispatch } from "react-redux";

// import { useStore } from "../store";
import { setCookie } from '../../utils/cookie'
import { setCookieService } from '../../api/api'
import { initUser } from '../../store/userSlice';


const Oauth = () => {
  const query = useQuery();
  // const store = useStore();
  const router = useHistory();
  const dispatch = useDispatch()

  let location = useLocation();
  console.log('location', location)

  const accessToken = query.get("token");
  const toPath = query.get("path")
    ? decodeURIComponent(query.get("path"))
    : "/";

  useMount(() => {
    console.log("mounted", accessToken);
    if (!accessToken) return;

    const setData = async () => {
      const result: any = await setCookieService({
        accessToken: accessToken
      })
      await dispatch(initUser())

      if (result.code === 0) {
        router.push(toPath);
      } else {
        alert('登陆失败')
      }
    }

    setData()
  });
  if (!accessToken) {
    return (
      <div className="msg">
        <p>Sorry. But Matataki OAuth login did not seems working.</p>
        <p>Please contract the matataki team for help</p>
        <p>or use traditional way to login.</p>
      </div>
    );
  }
  return (
    <div className="msg">
      <p>Redirecting to {toPath}, please wait.</p>
    </div>
  );
}

export default Oauth