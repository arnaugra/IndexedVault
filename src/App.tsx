import AppLayout from './layouts/Layout'
import './index.css'
import { Route, Router, Switch } from 'wouter'
import HomePage from './pages/home/HomePage'
import ProjectPage from './pages/project/ProjectPage'
import Page404 from './pages/Page404'
import SectionPage from './pages/section/SectionPage'
import { ProjectProvider } from './contexts/ProjectContext'
import { SectionProvider } from './contexts/SectionContext'

function App() {

  return (
    <ProjectProvider>
      <SectionProvider>
          <AppLayout>
            <Router>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/project/:project_uuid" component={ProjectPage} />
                <Route path="/project/:project_uuid/section/:section_uuid" component={SectionPage} />
                <Route path="*" component={Page404} />
              </Switch>
            </Router>
          </ AppLayout>
      </SectionProvider>
    </ProjectProvider>
  )
}

export default App
