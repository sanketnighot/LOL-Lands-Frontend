import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";

const MapComponent = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Map = ({ data }) => {
  const [lands, setLands] = useState(data);
  const [loading, setLoading] = useState(false);

  const fetchMap = async () => {
    try {
        const response = await axios.get("https://lolmapapi-5o64b.ondigitalocean.app/map/getMap").catch((err) => {
        console.log(err);
          });
          setLands(response.data);
    } catch (err) {
        console.log(err)
    }
		
	}
	useEffect( ()=> {
		const interval = setInterval(() => {
      try {
        fetchMap();
      } catch(err) {
        console.log(err);
      }
			
			}, 30000);
		return () => clearInterval(interval)
	},[]);

  fetchMap();
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
};

export const getServerSideProps = async (ctx) => {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "http";
  const url = `${protocol}://${ctx.req.headers.host}/api/land`;
  return { props: { data: (await axios.get(url)).data } };
};

export default Map;
