"use client";
import { useState } from "react";

async function QueryHook(url) {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  try {
    setPending(true);
    const request = await fetch(`${url}`);
    const data = await  request.json();
    if(!request.ok) {
      throw new Error(data.message);
    } 
    setSuccess(data.message);
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setPending(false);
  }

  return [pending, success, error, data];
}


export default QueryHook;