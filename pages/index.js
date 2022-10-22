import { Card, Grid, Typography } from "@mui/material";
import styled from "styled-components";
import styles from "./index.css";
import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";

const MapComponent = dynamic(() => import("../components/Map"), {
  ssr: false,
});
const HomeWrapper = styled.div`
  ${styles}
`;

export default function Home({ data }) {
  const [lands, setLands] = useState(data);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  const socketInitializer = async () => {
    setLoading(true)
    await axios.get("/api/socket");
    socketRef?.current = io();

    socketRef?.current.on("changed", (d) => {
      setLands((prev) => prev.map((x) => (x._id === d._id ? d : x)));
    });
    setLoading(false);
  };

  useEffect(() => socketInitializer(), []);
  return (
      <div>
      <Head>
        <title>LOL Map</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MapComponent lands={lands} loading={loading} />
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "http";
  const url = `${protocol}://${ctx.req.headers.host}/api/land`;
  return { props: { data: (await axios.get(url)).data } };
};