import TopBar from "../component/TopBar"
import Box from '@mui/system/Box';
import TopTracks from "../component/TopTracks"
import RecommendedTracks from "../component/RecommendedTracks";

function Home({token, setToken}){
    
    
    return (
        <>
            <TopBar/>
            <TopTracks token={token} setToken={setToken}/>
            <RecommendedTracks token={token} setToken={setToken}/>
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                This is a section container
            </Box>

        </>
        
    );
}
export default Home;