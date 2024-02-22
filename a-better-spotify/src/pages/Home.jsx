import TopBar from "../component/TopBar"
import Box from '@mui/system/Box';
import TopTracks from "../component/TopTracks"

function Home({token}){

    return (
        <>
            <TopBar/>
            <TopTracks token={token}/>
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                This is a section container
            </Box>

        </>
        
    );
}
export default Home;