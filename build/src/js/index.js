// importing the style file
import '../scss/style.scss';
// importing all typescript files?
import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';
import { showModal } from '../js/util/show-modal';
const init = () => {
    try {
        const prjInput = new ProjectInput();
        const prjActiveList = new ProjectList('active');
        const prjFinishedList = new ProjectList('finished');
    }
    catch (error) {
        // we need a type gaurd here to check the type of error we get
        if (error instanceof Error) {
            // console.log('Error: ' + error.message);
            console.log('Error is being caught in init function', error);
            showModal(`Error: ${error.message}`);
        }
        else {
            console.log('An unknown error occurred');
        }
    }
};
init();
//# sourceMappingURL=index.js.map