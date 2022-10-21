import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Button, Divider, TextField } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import dummyImg from "../public/dummy.svg";
import MapCanvas from "./MapCanvas";
import ContractConnect from "./ContractConnect";

const landTypeArr = [
  {
    text: "Sold",
    color: "#00FF47",
  },
  {
    text: "Auction",
    color: "#FAFF00",
  },
  {
    text: "Sale",
    color: "#FF0000",
  },
];

const premiumTypeArr = [
  {
    text: "Ultra Premium",
    color: "#FFCBFF",
  },
  {
    text: "Premium",
    color: "#AE61F7",
  },
  {
    text: "Platinum",
    color: "#3B0073",
  },
];

const sizeArr = [
  {
    text: "1x1",
  },
  {
    text: "3x3",
  },
  {
    text: "9x9",
  },
];

const drawerWidth = 300;

function Map({ lands, loading }) {

  const [currData, setCurrData] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [landType, setLandType] = useState();
  const [premiumType, setPremiumType] = useState();
  const [size, setSize] = useState();
  const [timer, setTimer] = useState();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <div>
      <Toolbar sx={{ background: "#0a213d" }}>
        <Image src="/logo.svg" alt="Logo" width={58} height={38} />
      </Toolbar>
      <Box p={4} sx={{ background: "#1C2128", height: "calc(100vh - 64px)" }}>
        <Box sx={{ background: "#343A43", borderRadius: 2 }} p={2} mb={4}>
          {landTypeArr?.map((res, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                background: landType === res ? "#252A34" : "",
                p: 1,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (landType === res) {
                  setLandType();
                } else {
                  setLandType(res);
                }
              }}
            >
              {res?.color && <CircleIcon sx={{ mr: 1, color: res?.color }} />}
              <Typography variant="body2" sx={{ color: "white" }}>
                {res?.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ background: "#343A43", borderRadius: 2 }} p={2} mb={4}>
          {premiumTypeArr?.map((res, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                background: premiumType === res ? "#252A34" : "",
                p: 1,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (premiumType === res) {
                  setPremiumType();
                } else {
                  setPremiumType(res);
                }
              }}
            >
              {res?.color && <CircleIcon sx={{ mr: 1, color: res?.color }} />}
              <Typography variant="body2" sx={{ color: "white" }}>
                {res?.text}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ background: "#343A43", borderRadius: 2 }} p={2} mb={4}>
          <Box mb={2}>
            <Typography variant="h5" color="grey">
              Coordinates
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Typography variant="body1" sx={{ color: "white" }}>
              Min (x,y)
            </Typography>
            <TextField placeholder="x" />
            <TextField placeholder="y" />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body1" sx={{ color: "white" }}>
              Max (x,y)
            </Typography>
            <TextField placeholder="x" />
            <TextField placeholder="y" />
          </Box>
        </Box>

        <Box sx={{ background: "#343A43", borderRadius: 2 }} p={2} mb={4}>
          {sizeArr?.map((res, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                background: size === res ? "#252A34" : "",
                p: 1,
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (size === res) {
                  setSize();
                } else {
                  setSize(res);
                }
              }}
            >
              {res?.color && <CircleIcon sx={{ mr: 1, color: res?.color }} />}
              <Typography variant="body2" sx={{ color: "white" }}>
                {res?.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );

//   useEffect( ()=> {
//     const interval = setInterval(async() => {
//       if (currData != {}) {
//         const getLand = await axios.get(
//           `https://lolmapapi-k9mkf.ondigitalocean.app/map/getTile?x=${currData.x}&y=${currData.y}`
//         );
//         if (getLand.status === "BOOKED") {
//         var final_time = new Date(getLand.updatedAt).getTime() + 120
//         var now = Date.parse(new Date().toUTCString())
//         var distance =  final_time - now;
//         var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//         var seconds = Math.floor((distance % (1000 * 60)) / 1000);
//         setTimer(minutes + "m " + seconds + "s ");    
//         }    
//       }
//       console.log(currData)
      
//     }, 10000);
//   return () => clearInterval(interval);
// },[]);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100%)` },
          ml: { sm: `${drawerWidth}px` },
          background: "#0a213d",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Lords of the Lands | Map
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" noWrap component="div" sx={{ color: "white" }}>
              PLEASE DO NOT REFRESH THE PAGE
            </Typography>
          </Box>
          <Button
            sx={{
              border: "1px solid #fff",
              borderRadius: "20px",
              paddingX: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "white" }}>
              View in Opensea
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      {/* <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          background: "rgb(99, 87, 156)",
        }}
      >
        {loading ? (
          <Box>Loading</Box>
        ) : (
          <Box>
            {lands?.length > 0 ? (
              <MapCanvas
                lands={lands}
                loading={loading}
                setCurrData={setCurrData}
                landType={landType}
                premiumType={premiumType}
                size={size}
              />
            ) : (
              "No lands!"
            )}
          </Box>
        )}
        {Object.keys(currData)?.length > 0 && (
          <>
            <Box
              p={2}
              sx={{
                background: "#1C2128",
                overflowY: "auto",
                position: "absolute",
                right: 0,
                top: 64,
                width: 400,
                height: "calc(100vh - 64px)",
              }}
              display={{
                xl: "block",
                lg: "block",
                md: "block",
                sm: "none",
                xs: "none",
              }}
            >
              <Image src="/lol.png" height={370} width={370} /><br/><br/>
              <ContractConnect data={currData} />
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={4} mb={2}>
                <Typography variant="h6" sx={{ color:  (currData.status === `BOOKED`) ? "Yellow" : (currData.status === `MINTED`) ? "#6CFF8A" : "White"}}>
                {(currData.status === `BOOKED`) ? <><p>BOOKED</p> Booked Lands update within 5 minute</> : (currData.status === "MINTED") ? "SOLD" : "FOR SALE"}<br/>
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={4}
                mb={2}
              >
                <Typography
                  variant="h5"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  {currData?.name?.split(" ")[0]}
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Image src={"/ether.svg"} width={17} height={17} />
                  <Typography variant="body1" sx={{ color: "white" }}>
                    {currData?.price}
                  </Typography>
                  
                </Box>
                
              </Box>
              <Divider sx={{ borderColor: "#FFFFFF", mb: 2 }} />
              <Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    Location
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <LocationOnIcon sx={{ color: "#6CFF8A" }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#6CFF8A" }}
                  >
                    {currData?.x}, {currData?.y}
                  </Typography>
                </Box>
                
              </Box>
            </Box>
            <Box
              p={2}
              sx={{
                background: "#1C2128",
                overflowY: "auto",
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
              }}
              display={{
                xl: "none",
                lg: "none",
                md: "none",
                sm: "block",
                xs: "block",
              }}
            >
              <ContractConnect data={currData} />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={4}
                mb={2}
              >
                <Typography
                  variant="h5"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  {currData?.name?.split(" ")[0]}
                </Typography>
                <Box display="flex" gap={1} alignItems="center">
                  <Image src={"/ether.svg"} width={17} height={17} />
                  <Typography variant="body1" sx={{ color: "white" }}>
                    {currData?.price}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: "#FFFFFF", mb: 2 }} />
              <Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    Location
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <LocationOnIcon sx={{ color: "#6CFF8A" }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#6CFF8A" }}
                  >
                    {currData?.x}, {currData?.y}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Map;
