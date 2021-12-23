import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import DependencyCheck from './DependencyCheck';
import Home from './Home';
import './App.css';
import { DepType, InfoType, InstallType } from './Types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (listener: string, func: unknown) => () => void;
        once: (listener: string, func: unknown) => void;
        checkDeps: () => void;
        installDep: (
          dep: DepType,
          installType: InstallType,
          packageName: string
        ) => void;
        setFile: (key: string, isDirectory: boolean) => void;
        setTimeLimit: (limit: number) => void;
        judge: () => void;
        openCaseInfo: (caseID: string, infoType: InfoType) => void;
      };
    };
  }
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={DependencyCheck} />
        <Route path="/home" component={Home} />
      </Switch>
    </Router>
  );
}
