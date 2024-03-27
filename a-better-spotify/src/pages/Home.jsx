import TopBar from "../component/TopBar"
import NewPlaylist from "../component/NewPlaylist"
import CustomMood from "../component/CustomMood"
import Box from '@mui/system/Box';
import TopTracks from "../component/TopTracks"
import RecommendedTracks from "../component/RecommendedTracks";
import TopArtists from "../component/TopArtists";
import WebPlayback from "../component/WebPlayback";
function Home({token, setToken}){
    
    
    return (
        <>
            <TopBar/>
            <div style={{display: "flex",}}>
                <TopTracks token={token} setToken={setToken}/>
                <TopArtists token = {token} setToken = {setToken}/>
                <NewPlaylist token={token} setToken={setToken}/>
                <CustomMood token={token} setToken={setToken}/> 
            </div>
            <WebPlayback token={token} setToken={setToken}/>

        </>
        
    );
}
export default Home;