import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', py: 3 }}>
      <Typography variant="body2" color="white" align="center">
        © 2024 Niraj Dhakal.
      </Typography>
    </Box>
  );
};

export default Footer;