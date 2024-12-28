import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap/dist/css/bootstrap.min.css'
import Files from './components/Files/Files';
import CodeEditor from './components/Editor/Editor';
import Terminal from './components/Terminal/Terminal';
import './app.css'
function App() {
  return <>
    <div className='container-fluid bg-dark h-100'>
      <div className='row ' style={{ height: '100vh' }} >

        <div className='col-auto bg-blue files'>
          <Files ></Files>

        </div>

        <div className='col bg-dark '>
          <CodeEditor ></CodeEditor>

        </div>
        {/* <iframe className='col bg-dark  h-100' src="https://solitary-developer.web.app"></iframe> */}




        <div className='col-12  border-top border-warning   p-0'>
          <Terminal></Terminal>

        </div>
      </div>
    </div>
  </>

}

export default App;