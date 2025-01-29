import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import ChatBox from './components/ChatBox'
import PrivacyPopup from './components/PrivacyPopup'
import Benefits from './components/Benefits'




const App = () => {

  return (
    <>
      <div className='pt-[4.5rem] lg:pt-[5.5rem] overflow-hidden'>
        <Header/>
        <Home />
        <Benefits />
        <Footer />
        <ChatBox />
        <PrivacyPopup />
      </div>
    
    
    </>
  )
}

export default App
