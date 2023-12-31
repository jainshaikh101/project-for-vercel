import React, { useState, useEffect } from "react";
import classess from "./style.module.scss";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { CustomSliderWithStyles } from "../../custom-mui-style/custom-mui-styles";
import FormControl from "@mui/material/FormControl";
import { grey } from "@mui/material/colors";
import { getFullYearWithRange, monthsOptions } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import { BsPlus } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import {
  deleteNewMusic,
  getNewMusicByID,
  postNewMusic,
  updateNewMusic,
} from "../../redux/slice/new-music";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteNewMusicRecordDialog from "../../dialogs/delete-new-music-record-dialog/delete-new-music-record-dialog";
import { Divider, Typography } from "@mui/material";
import { toast } from "react-toastify";

const NewMusic = ({
  newMusicIncomeArtistKeeps,
  new_music_income,
  artist_id,
  getArtistFunding,
  set_new_music_income,
}) => {
  const dispatch = useDispatch();
  const newMusicData = useSelector((state) => state.new_music.newMusic);
  const [includeMusicActive, setIncludeMusicActive] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [radioValue, setRadioValue] = useState("single");
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editRecord, setEditRecord] = useState();
  const [delete_new_music_records, setdelete_new_music_records] = useState();
  const [open, setOpen] = useState(false);

  const initUIData = () => {
    dispatch(
      getNewMusicByID({
        id: artist_id,
      })
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (year !== "") {
      setIsLoading(true);
      if (isEdit) {
        updateNewMusicRelease();
      } else {
        postNewMusicRelease();
      }
      getArtistFunding();
    } else {
      toast.error("please fill year field ");
    }
  };

  const postNewMusicRelease = () => {
    const current_date = new Date();
    const selected_date = new Date();
    selected_date.setMonth(parseInt(month));
    selected_date.setFullYear(parseInt(year));

    if (selected_date <= current_date) {
      toast.error("You cannot select past date.");
      setIsLoading(false);
    } else {
      const payload = {
        year,
        month: monthsOptions[parseInt(month)].value,
        music: radioValue,
        artist_id,
      };
      const request = dispatch(
        postNewMusic({
          data: payload,
        })
      );

      request
        .then(() => {
          setIsLoading(false);
          initUIData();
          emptyFields();
          setIncludeMusicActive(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          emptyFields();
          setIncludeMusicActive(false);
        });
    }
  };

  const updateNewMusicRelease = () => {
    const current_date = new Date();
    const selected_date = new Date();
    selected_date.setMonth(parseInt(month));
    selected_date.setFullYear(parseInt(year));

    if (selected_date <= current_date) {
      toast.error("You cannot select past date.");
      setIsLoading(false);
    } else {
      const payload = {
        year,
        month: monthsOptions[month].value,
        music: radioValue,
        artist_id: editRecord?.artist_id,
      };
      const request = dispatch(
        updateNewMusic({
          data: payload,
          id: editRecord?._id,
        })
      );

      request
        .then(() => {
          setIsLoading(false);
          initUIData();
          emptyFields();
          setIsEdit(false);
          setIncludeMusicActive(false);
        })
        .catch((error) => {
          setIsLoading(false);
          console.log(error);
          emptyFields();
          setIsEdit(false);
          setIncludeMusicActive(false);
        });
    }
  };
  const handleOpenDeleteDialog = (new_misic) => {
    setdelete_new_music_records(new_misic);
    setOpen(true);
  };
  const handleCloseDeleteDialog = (res) => {
    setOpen(false);
    if (res) {
      deleteNewMusicRelease(delete_new_music_records);
    }
  };
  const deleteNewMusicRelease = (id) => {
    const request = dispatch(
      deleteNewMusic({
        id: id,
      })
    );
    request
      .then(() => {
        initUIData();
        getArtistFunding();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (record) => {
    setIsEdit(true);
    setEditRecord(record);
    setYear(record?.year);
    let index = monthsOptions.findIndex((e) => e.value === record?.month);
    setMonth(index);
    setRadioValue(record?.music);
    setIncludeMusicActive(true);
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const cancelForm = () => {
    emptyFields();
    setIncludeMusicActive(false);
  };

  const emptyFields = () => {
    setMonth("");
    setYear(undefined);
    setRadioValue("single");
  };

  useEffect(() => {
    initUIData();
  }, []);

  return (
    <Box varient="div" component="div" className={classess.page}>
      <Box varient="div" component="div" className={classess.page__new_music}>
        <Box sx={{ fontSize: "12px" }}>
          <b>Note:</b> new music projects are based on historical tracks public
          training data; it is important to select tracks that would fairly
          represent the upcoming music. Please select new music tracks that best
          represent your next release(S)
        </Box>

        <Box
          varient="div"
          component="div"
          className={classess.page__music_container}
        >
          {/* {includeMusicActive && ( */}
          <Box
            varient="div"
            component="div"
            className={classess.page__music_container__button_container}
          >
            <Button
              type="button"
              onClick={() => setIncludeMusicActive(true)}
              className={
                classess.page__music_container__button_container__button
              }
              startIcon={<PiMusicNotesPlusBold />}
            >
              Add New Music
            </Button>
          </Box>

          {/* )} */}
        </Box>
      </Box>
      <Box pt={2}>
        {newMusicData && newMusicData.length ? (
          <Box
            varient="div"
            component="div"
            className={
              classess.page__music_container__button_container__slider_box
            }
          >
            <span
              className={classess.page__slider_container__slider_box__title}
              style={{
                color: " #4ffcb7 !important",
              }}
            >
              RECOUPMENT RATE
            </span>
            <Box
              varient="div"
              component="div"
              className={
                classess.page__music_container__button_container__slider_box__slider
              }
            >
              <CustomSliderWithStyles
                defaultValue={80}
                value={new_music_income}
                aria-label="Default"
                valueLabelDisplay="auto"
                name="new_music_income"
                onChange={(e) => set_new_music_income(e.target.value)}
                onChangeCommitted={(e, v) => newMusicIncomeArtistKeeps(e, v)}
                sx={{
                  "& .MuiSlider-rail": {
                    backgroundColor: "#192233", // Background color
                  },

                  "& .MuiSlider-thumb": {
                    backgroundColor: "#ffff", // Thumb color
                    width: "15px",
                    height: "15px",
                  },
                  "& .MuiSlider-track": {
                    borderColor: "#4ffcb7",
                    height: "3px",
                  },
                }}
              />
              <span
                component="div"
                className={
                  classess.page__music_container__button_container__slider_box__slider__text
                }
              >
                {new_music_income} %
              </span>
            </Box>
          </Box>
        ) : null}
      </Box>
      {includeMusicActive && (
        <Box
          varient="div"
          component="div"
          className={classess.page__new_music__main}
        >
          <Stack
            direction="row"
            gap={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              mt: 1,
            }}
          >
            <Box>
              <FormControl>
                <Typography
                  sx={{
                    color: "#4FFCB7",
                    fontSize: "12px",
                  }}
                >
                  TYPE OF TRACK
                </Typography>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={radioValue}
                  defaultValue={radioValue}
                  name="radio-buttons-group"
                  onChange={handleRadioChange}
                  sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <FormControlLabel
                    value="single"
                    control={
                      <Radio
                        sx={{
                          color: "#4ffcb7",
                          "&.Mui-checked": { color: "#4ffcb7" },
                        }}
                      />
                    }
                    label="Single"
                  />
                  <FormControlLabel
                    value="ep"
                    control={
                      <Radio
                        sx={{
                          color: "#4ffcb7",
                          "&.Mui-checked": { color: "#4ffcb7" },
                        }}
                      />
                    }
                    label="EP"
                  />
                  <FormControlLabel
                    value="album"
                    control={
                      <Radio
                        sx={{
                          color: "#4ffcb7",
                          "&.Mui-checked": { color: "#4ffcb7" },
                        }}
                      />
                    }
                    label="Album"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box>
              <form
                autoComplete="off"
                className={classess.page__new_music__main__form}
                onSubmit={onSubmit}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Box
                      varient="div"
                      component="div"
                      className={
                        classess.page__new_music__main__form__form_fields
                      }
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: "#4FFCB7",
                            fontSize: "12px",
                          }}
                        >
                          MONTH
                        </Typography>
                        <select
                          type="text"
                          name="month"
                          placeholder="Month"
                          value={month}
                          onChange={(e) => {
                            setMonth(e.target.value);
                          }}
                          className={
                            classess.page__new_music__main__form__form_fields__select
                          }
                          required
                        >
                          <option>Select Month</option>
                          {monthsOptions.map((month, index) => (
                            <option value={index}>{month.key}</option>
                          ))}
                        </select>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#4FFCB7",
                            fontSize: "12px",
                          }}
                        >
                          YEAR
                        </Typography>
                        <input
                          type="number"
                          min={getFullYearWithRange(0)}
                          maxLength={4}
                          minLength={4}
                          max={2033}
                          name="year"
                          placeholder="2023"
                          value={year}
                          onInput={(event) => setYear(event.target.value)}
                          className={
                            classess.page__new_music__main__form__form_fields__input
                          }
                          requried
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Box
                      varient="div"
                      component="div"
                      className={
                        classess.page__new_music__main__form__form_fields
                      }
                    >
                      <Button
                        type="submit"
                        className={classess.page__new_music__main__form__button}
                        disabled={isLoading}
                        startIcon={<BsPlus />}
                      >
                        {isLoading && (
                          <CircularProgress size={25} color="inherit" />
                        )}
                        Add
                      </Button>
                      <Button
                        type="button"
                        className={
                          classess.page__new_music__main__form__button2
                        }
                        disabled={isLoading}
                        onClick={cancelForm}
                        startIcon={<RxCross2 />}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </form>
            </Box>
          </Stack>
        </Box>
      )}

      {!includeMusicActive && (
        <Box
          varient="div"
          component="div"
          className={classess.page__music_details}
        >
          {newMusicData && newMusicData.length ? (
            <Box
              varient="div"
              component="div"
              className={classess.page__music_details__main_container}
            >
              {newMusicData.map((music) => (
                <Box
                  varient="div"
                  component="div"
                  className={classess.page__music_details__main_container__box}
                >
                  <Box
                    varient="div"
                    component="div"
                    className={
                      classess.page__music_details__main_container__box__details
                    }
                  >
                    <span
                      className={
                        classess.page__music_details__main_container__box__details__text
                      }
                    >
                      {music?.year}
                    </span>
                    <span
                      className={
                        classess.page__music_details__main_container__box__details__text
                      }
                    >
                      {music?.music}
                    </span>
                  </Box>
                  <Box
                    varient="div"
                    component="div"
                    className={
                      classess.page__music_details__main_container__box__actions
                    }
                  >
                    <IconButton
                      aria-label="fingerprint"
                      color="primary"
                      style={{ backgroundColor: "#ffffff20" }}
                      onClick={() => handleEdit(music)}
                    >
                      <EditIcon style={{ color: "#2F3443" }} />
                    </IconButton>
                    <IconButton
                      aria-label="fingerprint"
                      color="error"
                      style={{ backgroundColor: "#F6400020" }}
                      onClick={() => handleOpenDeleteDialog(music?._id)}
                    >
                      <CloseIcon style={{ color: "#F64000" }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>
      )}
      <DeleteNewMusicRecordDialog
        onClose={handleCloseDeleteDialog}
        open={open}
        track={delete_new_music_records}
      />
      <Divider
        sx={{
          backgroundColor: "#5A7380",
          width: "100%",
          mt: 2,
        }}
      ></Divider>
    </Box>
  );
};

export default NewMusic;
