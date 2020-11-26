import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Fib = () => {
  // const initState = {
  //   seenIndexes: [],
  //   values: {},
  //   index: '',
  // };
  const [values, setValues] = useState({});
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [index, setIndex] = useState(0);

  const fetchValues = async () => {
    try {
      const res = await axios.get('/api/values/current');
      setValues(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchIndexes = async () => {
    try {
      const res = await axios.get('/api/values/all');
      setSeenIndexes(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const onChange = (e) => {
    setIndex({ index, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/values', index);
    setIndex(0);
  };
  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };
  const renderValues = () => {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [values, seenIndexes]);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Enter your index:</label>
        <input value={index} onChange={(e) => onChange(e)} />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes}

      <h3>Calculated Values:</h3>
      {renderValues}
    </div>
  );
};
