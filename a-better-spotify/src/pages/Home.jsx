import TopBar from "../component/TopBar"
import NewPlaylist from "../component/NewPlaylist"
import Box from '@mui/system/Box';
import TopTracks from "../component/TopTracks"

function Home({token, setToken}){

    return (
        <>
            <TopBar/>
            <div style={{display: "flex"}}>
                <TopTracks token={token} setToken={setToken}/>
                <NewPlaylist token={token} setToken={setToken}/>
            </div>

        </>
        
    );
}
export default Home;