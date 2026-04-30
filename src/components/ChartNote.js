import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function ChartNote({ text }) {
  return (
    <Box sx={{
      marginTop: '16px',
      padding: '10px 12px',
      backgroundColor: '#F5F5F5',
      borderRadius: '4px',
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start',
    }}>
      <InfoOutlinedIcon sx={{ fontSize: '0.95rem', color: '#757575', marginTop: '2px', flexShrink: 0 }} />
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
        {text}
      </Typography>
    </Box>
  );
}

export default ChartNote;
