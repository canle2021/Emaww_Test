import React, { useState } from "react";
import axios from "axios";
import { parseString } from "xml2js";
import Dropzone from "react-dropzone";

function App() {
  const [xmlData, setXmlData] = useState(null);
  const [redisKey, setRedisKey] = useState("");
  const [status, setStatus] = useState("");

  const onDrop = (files) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      parseXml(content);
    };

    reader.readAsText(file);
  };

  const parseXml = (xmlString) => {
    parseString(xmlString, (err, result) => {
      if (err) {
        console.error(err);
        setStatus("Error parsing XML");
      } else {
        setXmlData(result);
        setStatus("XML parsed successfully");
      }
    });
  };

  const sendDataToRedis = async () => {
    if (!xmlData || !redisKey) {
      setStatus("Please upload an XML file and enter a Redis key.");
      return;
    }

    try {
      const response = await axios.post("/storeData", {
        key: redisKey,
        value: JSON.stringify(xmlData),
      });

      if (response.status === 200) {
        setStatus("Data sent to Redis successfully.");
      } else {
        setStatus("Error sending data to Redis.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error sending data to Redis.");
    }
  };

  return (
    <div className="App">
      <h1>XML to Redis Exporter</h1>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag and drop an XML file here, or click to select one</p>
          </div>
        )}
      </Dropzone>
      <div className="form">
        <label>Redis Key:</label>
        <input
          type="text"
          placeholder="Enter a Redis key"
          value={redisKey}
          onChange={(e) => setRedisKey(e.target.value)}
        />
        <button onClick={sendDataToRedis}>Send to Redis</button>
      </div>
      <p>Status: {status}</p>
    </div>
  );
}

export default App;
