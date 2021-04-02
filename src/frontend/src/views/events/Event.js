import React, { useEffect, useState } from 'react';
import { Page } from 'components';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Event';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { searchEvent, createEvent, changeSearchCriteria } from "../../services/events";
import { useFormHandler } from "../../utils/hooks";
import reeValidate from 'ree-validate';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  paper: {
    background: "#F0F0F0",
    padding: theme.spacing(6),
    width: '100%',
  },
  divider: {
    marginTop: '15px',
    marginBottom: '15px'
  },
  calendar: {
    paddingLeft: '55px',
  }
}));

const dictionary = {
  en: {
    attributes: {
      name: 'name',
      start_date: 'start date',
      end_date: 'end date',
    }
  },
};

const validator = new reeValidate({
  name: 'required',
  start_date: 'required',
  end_date: 'required',
});

function Event() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [addEventFlag, setAddEventFlag] = useState(false);
  const list = useSelector(state => state.events.list);

  const [formState, handleChange, submitForm, hasError, clearErrors] = useFormHandler(validator);
  const [initFormState, setInitFormState] = useState(false);
  validator.localize(dictionary);
  const localizer = momentLocalizer(moment)

  const [startDate, setStartDate] = useState(moment().clone().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().clone().endOf('month').format('YYYY-MM-DD'));
  const [optionDays, setOptionDays] = React.useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [month, setMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  useEffect(() => {
    dispatch(searchEvent(keyword));
    setAddEventFlag(false);
  }, [keyword, addEventFlag]);

  useEffect(() => {
    let temp = [];
    list.forEach((event) => {
      event.dates.forEach((date) => {
        temp.push({
          title: event.name,
          allDay: true,
          start: new Date(date.date),
          end: new Date(date.date)
        });
      })
    });
    setCalendarEvents(temp);
  }, [list]);

  useEffect(() => {
    if (!initFormState) {
      formState.values = {
        name: '',
        start_date: startDate,
        end_date: endDate,
        days: []
      };
      setInitFormState(true);
      clearErrors();
    }
  }, [initFormState]);

  const onSubmit = () => {
    convertDays();
    submitForm(() => {
      setLoading(true);
      dispatch(createEvent(formState.values))
        .then(() => {
          setAddEventFlag(true);
        })
        .catch(e => {
          const errors = e.response.data.error;
          console.log(e.response);
          Object.keys(errors).forEach(value => {
            validator.errors.add(value, errors[value][0]);
          });
        }).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleDateChange = (event) => {
    const type = event.target.name;
    if (type === 'start_date') {
      formState.values.start_date = event.target.value;
      setStartDate(event.target.value);
    }
    if (type === 'end_date') {
      formState.values.end_date = event.target.value;
      setEndDate(event.target.value);
    }
  };

  const handleDaysChange = (event) => {
    setOptionDays({ ...optionDays, [event.target.name]: event.target.checked });
  };

  const convertDays = () => {
    let tempDays = []
    if (optionDays.monday) {
      tempDays.push(1);
    }
    if (optionDays.tuesday) {
      tempDays.push(2);
    }
    if (optionDays.wednesday) {
      tempDays.push(3);
    }
    if (optionDays.thursday) {
      tempDays.push(4);
    }
    if (optionDays.friday) {
      tempDays.push(5);
    }
    if (optionDays.saturday) {
      tempDays.push(6);
    }
    if (optionDays.sunday) {
      tempDays.push(7);
    }
    formState.values.days = tempDays;
    return tempDays;
  }

  return (
    <Page title="Events">
      <Grid container direction="column" alignItems="center" justify="space-between" spacing={2}>
        <Grid container item direction="column" alignItems="flex-start" xs={12} sm={12} md={10}
              lg={10}>
          <Typography variant="h2">
            Events
          </Typography>
        </Grid>
        <Grid container item xs={12} sm={12} md={10} lg={10} xl={10}>
          <Paper className={classes.paper}>
            <Grid container item direction="row" md={12}>
              <Grid item md={4}>
                <Grid container item direction="row" md={12} spacing={3}>
                  <Grid item md={12}>
                    <TextField fullWidth variant="outlined" label="Event Name" id="name" name="name"
                               onChange={handleChange}
                               error={hasError('name')}/>
                  </Grid>
                </Grid>
                <Grid container item direction="row" md={12} spacing={3}>
                  <Grid item md={6}>
                    <TextField fullWidth variant="outlined" id="date" type="date"
                               defaultValue={startDate}
                               name="start_date"
                               className={classes.textField} label='Start Date'
                               onChange={handleDateChange}
                               InputLabelProps={{
                                 shrink: true,
                               }}
                    />
                  </Grid>
                  <Grid item md={6}>
                    <TextField fullWidth variant="outlined" id="date" type="date"
                               defaultValue={endDate}
                               name="end_date"
                               className={classes.textField} label='End Date'
                               onChange={handleDateChange}
                               InputLabelProps={{
                                 shrink: true,
                               }}
                    />
                  </Grid>
                </Grid>
                <Grid container item direction="row" md={12} spacing={3}>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.monday}
                          onChange={handleDaysChange}
                          name="monday"
                          color="primary"
                        />
                      }
                      label="Monday"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.tuesday}
                          onChange={handleDaysChange}
                          name="tuesday"
                          color="primary"
                        />
                      }
                      label="Tuesday"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.wednesday}
                          onChange={handleDaysChange}
                          name="wednesday"
                          color="primary"
                        />
                      }
                      label="Wednesday"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.thursday}
                          onChange={handleDaysChange}
                          name="thursday"
                          color="primary"
                        />
                      }
                      label="Thursday"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.friday}
                          onChange={handleDaysChange}
                          name="friday"
                          color="primary"
                        />
                      }
                      label="Friday"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.saturday}
                          onChange={handleDaysChange}
                          name="saturday"
                          color="primary"
                        />
                      }
                      label="Saturday"
                    />
                  </Grid>
                  <Grid item md={3}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={optionDays.sunday}
                          onChange={handleDaysChange}
                          name="sunday"
                          color="primary"
                        />
                      }
                      label="Sunday"
                    />
                  </Grid>
                </Grid>
                <Grid container item direction="row" justify="flex-end" alignItems="flex-end" md={12} spacing={3}>
                  <Grid item md={4}>
                    <Button variant="contained" color="primary" fullWidth={true} onClick={onSubmit}>
                      Save
                    </Button>
                  </Grid>
                </Grid>
                <hr className={classes.divider}/>
                <Grid container item direction="row" justify="flex-start" alignItems="flex-start" md={12} spacing={3}>
                  <Grid item md={12}>
                    <Typography variant="h4">
                      List of Events:
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <List>
                      {list.map((event, i) =>
                        <ListItem key={i}>
                          <ListItemIcon>
                            <FolderIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={event.name}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                </Grid>
              </Grid>
              <Grid item md={8}>
                <Grid container item md={12} className={classes.calendar}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600, width: 800 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
}

export default Event;
