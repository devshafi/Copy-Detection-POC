import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import CopyDetectForm from './components/CopyDetectForm';
import MainAppBar from './components/MainAppBar';
import { theme } from './utils/theme';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function App() {

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MainAppBar />
        <Container component="main" maxWidth={false}>
          <CopyDetectForm />
        </Container>
      </QueryClientProvider>

    </ThemeProvider>
  );
}

export default App;
