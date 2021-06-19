import React, {useState} from "react"
import {TextField} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {styled} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CreateIcon from '@material-ui/icons/Create';
import CheckIcon from '@material-ui/icons/Check';

import './App.css';

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    alignItems: 'center',
}));

function getCurrentTime() {
    var tempDate = new Date();
    var yearString = String(tempDate.getFullYear()).slice(2);
    var AM = (tempDate.getHours() < 12);
    var time = "";
    var hours = tempDate.getHours();
    if (hours !== 12) {
        hours = hours % 12;
    }
    if (AM) {
        time = "AM";
    } else {
        time = "PM"
    }
    if (hours == 0) hours = 12;
    var date = hours + ":" + tempDate.getMinutes() + time + "\t" + Number(tempDate.getMonth() + 1) + "/" + tempDate.getDate() + '/' + yearString;
    return date;
}

function ItemInput(props) {
    /*
    state lets a component create and manage its own data. 
    If state changes, react is notified and re-renders the component in DOM
    so when any of the below arrays are changed react re-renders them for us.
    
    */
    const [item, setItem] = useState("");  // defaults as an empty string
    const [items, setItems] = useState([]); // default empty array
    const [itemEditing, setItemEditing] = useState(null); // default null
    let [editingText, setEditingText] = useState(""); // default empty string

    function handleSubmit(e) {
        e.preventDefault(); //this prevents the page from refreshing when you submit with the enter key
        if (!items.some(x => x.text === item)) { // this line prevents items with the same text form being added to the setItems array.
            const newItem = { //this is our item object
                id: new Date().getTime(),
                text: item,
                time: getCurrentTime(),
                completed: false
            };
            setItems([...items, newItem]); //look up spread operators - basically [...items] represents the entire items array

        } else {
            alert("Please avoid duplicates");
        }
        setItem("");
    }

    function submitEdits(id) {
        const updatedTodos = [...items].map((item) => {
            if (item.id === id && (editingText !== "") &&
                ((!items.some(x => x.text === editingText)))) {
                item.text = editingText;
            }
            return item;
        });
        setItems(updatedTodos); // update the setItems array with our change
        setItemEditing(null); // after we finish edit, we are now editing nothing
        setEditingText(""); // empty the edit
    }

    function deleteItem(id) {
        let newItems = items.filter(item => item.id !== id);
        setItems(newItems);
    }

    function completion(id) {
        const completetodo = [...items].map((item) => {
            if (item.id === id) {
                item.completed = !item.completed;
            }
            return item;
        });
        setItems(completetodo); // update the setItems array with our change
    }

    //map is just a glorified loop, below loops through the items array and displays the below JSX/HTML
    const itemlist = items.map((item) => (
        <div key={item.id}>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Item>
                            {item.id === itemEditing ? (
                                <form onSubmit={e => {
                                    e.preventDefault();
                                    setEditingText(editingText);
                                    submitEdits(item.id);
                                }}>
                                    <TextField
                                        color="secondary"
                                        type="text"
                                        onChange={(e) => setEditingText(e.target.value)}
                                        defaultValue={item.text}
                                    />
                                </form>
                            ) : (
                                <>
                                    <div
                                        className={item.completed === true ? ("completed") : ("incomplete")}>{item.text}</div>
                                    <div>{item.time}</div>
                                </>
                            )}
                            {item.id === itemEditing ? (
                                <IconButton onClick={() => submitEdits(item.id)}>
                                    <CreateIcon fontSize="large"/>
                                </IconButton>
                            ) : (
                                <IconButton onClick={() => {
                                    setItemEditing(item.id);
                                }}>
                                    <CreateIcon fontSize="default"/>
                                </IconButton>
                            )}
                            <IconButton onClick={() => deleteItem(item.id)}>
                                <DeleteIcon fontSize="default"/>
                            </IconButton>
                            <IconButton onClick={() => completion(item.id)}>
                                <CheckIcon fontSize="default"/>
                            </IconButton>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    ))

    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="What do you want to do?"
                    color="primary"
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    fullWidth
                    required={true}
                    data-testid="new-item-input"
                />
            </form>
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                data-testid="new-item-button">
                <div>add to-do!</div>
            </Button>
            <div>{itemlist}</div>
        </>
    );
}

function App() {

    return (
        <div className="App">
            <h1>To-Do list</h1>
            <ItemInput data-testid="new-item-input" data-testid="new-item-button"/>
        </div>
    );
}


export default App;
