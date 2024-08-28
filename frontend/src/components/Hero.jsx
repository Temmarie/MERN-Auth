import { Container, Card} from 'react-bootstrap';

const Hero = () => {
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>Dashboard</h1>
          <p className='text-center mb-4'>
           Welcome 
          </p>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;


