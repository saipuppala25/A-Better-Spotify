import TopBar from "../component/TopBar"
import Box from '@mui/system/Box';

function Home({token}){

    return (
        <>
            <TopBar/>
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                This is a section container
            </Box>

        </>
        
    );
}
export default Home;