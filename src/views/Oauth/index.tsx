import React from 'react';
import { useMount } from "ahooks";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
// import { useStore } from "../store";
import { setCookie } from '../../utils/cookie'

const Oauth = () => {
  const query = useQuery();
  // const store = useStore();
  const router = useHistory();

  const accessToken = query.get("token");
  // const toPath = query.get("path")
  //   ? decodeURIComponent(query.get("path"))
  //   : "/";
  const toPath = '/'

  useMount(() => {
    console.log("mounted", accessToken);
    console.log("useLocation()", query.get('x-access-token'));
    if (!accessToken) return;
    setCookie("x-access-token", accessToken);
    router.replace(toPath);
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


