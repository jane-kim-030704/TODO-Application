//Basic
import * as React from 'react'; //import React library
import './style.css'; //import CSS file from local

//MUI Imports
import AppBar from '@mui/material/AppBar'; //import blue navigation bar (top)
import Toolbar from '@mui/material/Toolbar'; //align AppBar horizontally
import Button from '@mui/material/Button'; //buttons
import { styled } from '@mui/material/styles'; //ADD TASK button styling
import { darken } from '@mui/material/styles'; //ADD TASK button hovering
import Snackbar from '@mui/material/Snackbar'; //notification
import MuiAlert, { AlertProps } from '@mui/material/Alert'; //alert
import Paper from '@mui/material/Paper';

//main table
import TableContainer from '@mui/material/TableContainer'; //Form container (with scroll)
import Table from '@mui/material/Table'; //Table for aligning
import TableHead from '@mui/material/TableHead'; //header
import TableRow from '@mui/material/TableRow'; //each row
import TableCell from '@mui/material/TableCell'; //Form Entries
import TableBody from '@mui/material/TableBody'; //Entry container
import Checkbox from '@mui/material/Checkbox'; //completion

//MUI Icons
import MenuIcon from '@mui/icons-material/Menu'; //3-bar menu icon
import AddCircleIcon from '@mui/icons-material/AddCircle'; //ADD (main & form)
import EditNoteIcon from '@mui/icons-material/EditNote'; //UPDATE (main)
import CancelIcon from '@mui/icons-material/Cancel'; //DELETE (main)
import BlockIcon from '@mui/icons-material/Block'; //CANCEL (form)

//Form
import Dialog from '@mui/material/Dialog'; //pop-up form
import DialogActions from '@mui/material/DialogActions'; //with button
import DialogContent from '@mui/material/DialogContent'; //content
import TextField from '@mui/material/TextField'; //textfield (Title & Description)
import Radio from '@mui/material/Radio'; //radios (priority)
import RadioGroup from '@mui/material/RadioGroup'; //groups radios
import FormControl from '@mui/material/FormControl'; //whole
import FormLabel from '@mui/material/FormLabel'; //title
import FormControlLabel from '@mui/material/FormControlLabel'; //each priority

//Date Picker
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'; //Date Picker for destops
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; //library
import dayjs from 'dayjs'; //library
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; //local time

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


//customize add button on the main (with matching theme)
const MainAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: darken(theme.palette.primary.main, 0.2),
  },
}));

//Button in the form (ADD)
const FormAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: darken(theme.palette.primary.dark, 0.2),
  },
}));

//Button in the form (EDIT)
const FormEditButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: darken(theme.palette.primary.dark, 0.2),
  },
}));

//Button in the form (ADD or EDIT)
const FormCancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: darken(theme.palette.error.dark, 0.2),
  },
}));

//Update Button
const MainUpdateButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: darken(theme.palette.primary.dark, 0.2),
  },
}));

//Delete Button
const MainDeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: darken(theme.palette.error.dark, 0.2),
  },
}));

// Define Task interface here
interface typesArr {
  title: string;
  description: string;
  deadline: dayjs.Dayjs;
  priority: string;
  complete: boolean;
}

function Main() {
  //re-render whenever change made
  //current values
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [date, setDate] = React.useState(dayjs());
  const [priority, setPriority] = React.useState<string>('low'); //default to low
  const [entryArr, setEntryArr] = React.useState<typesArr[]>([]); //compilation

  //check for any error in user input
  const [titleError, setTitleError] = React.useState<string>(''); //title error
  const [descriptionError, setDescriptionError] = React.useState<string>(''); //description error

  //dialog control
  const [popup, setPopup] = React.useState<boolean>(false); //visibility of dialog popup
  const [editMode, setEditMode] = React.useState<boolean>(false); //differentiate adding (initial task) and editting form

  //notification control
  const [toaster, setToaster] = React.useState<boolean>(false);
  const [toasterText, setToasterText] = React.useState<string>('');

  {
    /*---------------------------------------------------------------*/
  }

  //adding todo (update & new add)
  const addEntry = () => {
    //check for correct entries
    if (!checkEntry()) return;

    //new entry object
    const newEntry: typesArr = {
      title,
      description,
      deadline: date,
      priority,
      complete: false,
    };

    //add new entry
    addTodo(newEntry);

    //reset upon completion
    reset();
  };

  //update the data (edit button)
  const updateEntry = () => {
    //if matching title found, update
    const updatedList = entryArr.map((todo) =>
      todo.title === title
        ? { ...todo, description, deadline: date, priority, complete: false }
        : todo
    );

    //track update status
    const isUpdated = updatedList.some((todo) => todo.title === title);

    //update entryArr with new list
    if (isUpdated) {
      setEntryArr(updatedList);
      openToaster('Task was updated successfully!');

      //reset upon completion
      reset();
    }
  };

  //add new todo
  const addTodo = (newTodo) => {
    setEntryArr((list) => [...list, newTodo]);
    //display toaster message
    openToaster('Task was added successfully!');
  };

  //reset the entries
  const reset = () => {
    setTitle('');
    setDescription('');
    setDate(dayjs());
    setPriority('low');
    setPopup(false);
  };

  //Deleting todo
  const deleteEntry = (inputArr) => {
    //update entryArr
    setEntryArr((list) =>
      //collect remainder todo's after deletion & initializing empty
      list.reduce((resultArr, task) => {
        //if task is not to be deleted, push to resultArr
        if (task.title !== inputArr.title) {
          resultArr.push(task);
        }
        return resultArr;
      }, [])
    );
    //display toaster message
    openToaster('Task was deleted successfully!');
  };

  //Display toaster notification (success opening)
  const openToaster = (toasterText) => {
    setToaster(true); //open the toaster
    setToasterText(toasterText); //save the toaster text
  };

  //Close toaster
  const closeToaster = () => {
    setToaster(false); //close the toaster
  };

  //Edit (for update)
  const updatePressed = (update) => {
    setPopup(true);
    setEditMode(update);
  };

  //Edit (for update)
  const updateInfo = (entry) => {
    setTitle(entry.title);
    setDescription(entry.description);
    setDate(entry.deadline);
    setPriority(entry.priority);
    setPopup(true);
    setEditMode(true);
  };

  //save the title and description user typed in
  const saveInput = (type, userInput) => {
    if (type === 'title') {
      //save title
      setTitle(userInput);
    } 
    else if (type === 'description') {
      //save description
      setDescription(userInput);
    }

    //check if user input is valid
    checkInput(type, userInput);
  };

  //save the date user selected
  const saveDate = (inputDate) => {
    if (inputDate) {
      setDate(inputDate);
    }
  };

  //change based on complete checkbox
  const changeComplete = (inputArr) => {
    //update entryArr
    setEntryArr((currArr) => {
      const index = currArr.findIndex((todo) => todo.title === inputArr.title);
      //if specific element was found, toggle complete
      if (index !== -1) {
        const newArr = [...currArr]; //copy every element in currArr
        //toggle complete
        newArr[index] = { ...newArr[index], complete: !newArr[index].complete };
        return newArr;
      }
      return currArr;
    });
  };

  //check if user input is in correct format
  const checkInput = (type, userInput) => {
    let trackInput = true; //track if input is in correct format

    // check if title is correct
    if (type === 'title') {
      //empty title, incorrect input
      if (!userInput) {
        setTitleError('Title is Required!');
        trackInput = false;
      }
      //same title
      else {
        // use titleExists to check if same task exists
        const exists = titleExists(userInput);

        //if exists, incorrect input
        if (exists) {
          setTitleError('Already Existing Title!');
          trackInput = false;
        }
        //if does not exists, correct input
        else {
          setTitleError('');
        }
      }
    }

    // check if description is correct
    else if (type === 'description') {
      //empty description, incorrect input
      if (!userInput) {
        setDescriptionError('Description is Required!');
        trackInput = false;
      }
      //if not empty, correct input
      else {
        setDescriptionError('');
      }
    }

    return trackInput;
  };

  //check if same title exists
  const titleExists = (title) => {
    return entryArr.some((element) => element.title === title);
  };

  //check input
  const checkEntry = () => {
    //check title
    const checkTitle = checkInput('title', title);
    //check description
    const checkDescription = checkInput('description', description);

    return checkTitle && checkDescription;
  };

  {
    /*---------------------------------------------------------------*/
  }

  //HTML
  return (
    <div>
      {/*toaster message*/}
      <Snackbar
        id="snackbar"
        open={toaster}
        onClose={() => closeToaster()}
        autoHideDuration={2000}
      >
        <MuiAlert
          variant="filled"
          onClose={() => closeToaster()}
          severity="success"
          color="info"
        >
          {toasterText}
        </MuiAlert>
      </Snackbar>

      {/*top title bar*/}
      <div className="barContainer">
        <AppBar position="static">
          <Toolbar>
            {/*Title*/}
            <div className="menuBox">
              <MenuIcon />
              <span>FRAMEWORKS</span>
            </div>

            {/*Button*/}
            <div className="addButtonBox">
              <MainAddButton onClick={() => updatePressed(false)}>
                <AddCircleIcon />
                Add
              </MainAddButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>

      {/* Add/Edit Task Dialog */}
      <Dialog open={popup} onClose={reset} maxWidth="xs">
        <AppBar position="static">
          <Toolbar>
            {editMode ? <EditNoteIcon /> : <AddCircleIcon />}
            <span>{editMode ? 'Edit Task' : 'Add Task'}</span>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <form>
            <Card className="spacing">
              {/*Title*/}
              {!editMode && (
                <TextField
                  className="entry"
                  label="Title"
                  value={title}
                  onChange={(event) => saveInput('title', event.target.value)}
                  required
                  error={!!titleError}
                  helperText={titleError}
                />
              )}
            </Card>
            <div className="spacing">
              {/*Description*/}
              <TextField
                className="entry"
                label="Description"
                value={description}
                onChange={(event) =>
                  saveInput('description', event.target.value)
                }
                required
                error={!!descriptionError}
                helperText={descriptionError}
              />
            </div>
            <div className="spacing">
              {/*Date*/}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  className="entry"
                  label="Deadline"
                  value={date}
                  onChange={saveDate}
                />
              </LocalizationProvider>
            </div>
            <div className="spacing">
              {/*Priority*/}
              <FormControl className="entry">
                <FormLabel>Priority</FormLabel>
                <RadioGroup
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  row
                >
                  {['Low', 'Med', 'High'].map((level) => (
                    <FormControlLabel
                      key={level.toLowerCase()}
                      value={level.toLowerCase()}
                      control={<Radio />}
                      label={level}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </form>
        </DialogContent>

        <DialogActions>
          {/*Add or Edit Button*/}
          {editMode ? (
            <FormEditButton onClick={updateEntry} startIcon={<EditNoteIcon />}>
              EDIT
            </FormEditButton>
          ) : (
            <FormAddButton onClick={addEntry} startIcon={<AddCircleIcon />}>
              ADD
            </FormAddButton>
          )}

          {/*Cancel Button*/}
          <FormCancelButton onClick={reset} startIcon={<BlockIcon />}>
            CANCEL
          </FormCancelButton>
        </DialogActions>
      </Dialog>

      {/*Entry Table*/}
      <TableContainer component={Paper}>
        <Table className="mainTable">
          {/*Title*/}
          <TableHead>
            <TableRow>
              <TableCell className="atCenter">Title</TableCell>
              <TableCell className="atCenter">Description</TableCell>
              <TableCell className="atCenter">Deadline</TableCell>
              <TableCell className="atCenter">Priority</TableCell>
              <TableCell className="atCenter">Is Complete</TableCell>
              <TableCell className="atCenter">Action</TableCell>
            </TableRow>
          </TableHead>

          {/*Todo tasks*/}
          <TableBody>
            {entryArr.map((row) => (
              <TableRow key={row.title}>
                {/*Title*/}
                <TableCell className="atCenter">{row.title}</TableCell>
                {/*Description*/}
                <TableCell className="atCenter">{row.description}</TableCell>
                {/*Deadline*/}
                <TableCell className="atCenter">
                  {row.deadline.format('MM/DD/YY')}
                </TableCell>
                {/*Priority*/}
                <TableCell className="atCenter">{row.priority}</TableCell>
                {/*Is Complete*/}
                <TableCell className="atCenter">
                  <Checkbox
                    checked={row.complete}
                    onChange={(event) => changeComplete(row)}
                  />
                </TableCell>
                {/*Action*/}
                <TableCell className="atCenter">
                  {!row.complete && (
                    <div>
                      <MainUpdateButton
                        onClick={() => {
                          updateInfo(row);
                          updatePressed(true);
                        }}
                        startIcon={<EditNoteIcon />}
                      >
                        Update
                      </MainUpdateButton>
                    </div>
                  )}
                  <div>
                    <MainDeleteButton
                      onClick={() => deleteEntry(row)}
                      startIcon={<CancelIcon />}
                    >
                      Delete
                    </MainDeleteButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const Todo = () => (
  <div>
    <Main />
  </div>
);

export default Todo;
