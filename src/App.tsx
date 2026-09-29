import { Home,Header } from './components/Home'
import { Route, Routes } from 'react-router'
import './App.css'
import { MediaHome, MediaRecord, MediaView } from './components/Media'


function App() {


  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie' element={<MediaHome title='MOVIEホーム' basePath='movie' />} />
        <Route path='/movie/record' element={<MediaRecord title='MOVIE' recordName='movieRecords' />} />
        <Route path='/movie/view' element={<MediaView title='MOVIE' recordName='movieRecords'/>} />
        <Route path='/comic' element={<MediaHome title='漫画ホーム' basePath='comic' />} />
        <Route path='/comic/record' element={<MediaRecord title='漫画' recordName='comicRecords' />} />
        <Route path='/comic/view' element={<MediaView title='漫画' recordName='comicRecords'/>} />
      </Routes>
    </>
  )
}

export default App
