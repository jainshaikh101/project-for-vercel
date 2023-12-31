/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import classess from "./style.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Circle from "@mui/icons-material/Circle";
import Button from "@mui/material/Button";
import axios from "axios";
import { config as URLconfig } from "../../enviorment/enviorment";
import AuthEnum from "../../enums/auth.enum";
import { getItemToLocalStorage } from "../../services/storage";
import { Container, Grid, IconButton } from "@mui/material";
import moment from "moment";
import { GrView } from "react-icons/gr";
import { AiOutlineCloudDownload, AiOutlineCheck } from "react-icons/ai";
import { RiExternalLinkFill } from "react-icons/ri";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import PdfImage from "../../assets/pdf-image.png";
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import VerificationPortalConfirmationDialog from "../../dialogs/verification-portal-confirmation-dialog/verification-portal-confirmation-dialog";

// import { Modal, Dialog, Image } from "@mui";
// import {Modal} from"@m

const KYCList = () => {
  const [list, setList] = useState([]);
  const [visibility, setVisibility] = useState(null);
  const [openFront, setOpenFront] = useState(false);
  const [openBack, setOpenBack] = useState(false);

  const handleOpenFront = () => {
    setOpenFront(true);
  };
  const handleCloseFront = () => {
    setOpenFront(false);
  };

  const handleOpenBack = () => {
    setOpenBack(true);
  };
  const handleCloseBack = () => {
    setOpenBack(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    let isSubscribed = true;
    axios({
      url: `${URLconfig.SMART_PHONE_BASE_URL}/app-kyc`,
      method: "GET",
      headers: {
        authorization: `Bearer ${getItemToLocalStorage(AuthEnum.TOKEN)}`,
      },
    })
      .then((response) => {
        if (isSubscribed) {
          setList(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleToggle = (id) => {
    setVisibility(visibility === id ? null : id);
  };

  const rejectHandler = (id) => {
    setVisibility(null);

    let configAuth = {
      headers: {
        authorization: `Bearer ${getItemToLocalStorage(AuthEnum.TOKEN)}`,
      },
    };

    setList(
      list.map((item) =>
        item._id === id
          ? {
              ...item,
              status: "rejected",
            }
          : item
      )
    );
    axios
      .put(
        `${URLconfig.SMART_PHONE_BASE_URL}/app-kyc/${id}/rejected`,
        null,
        configAuth
      )
      .then((e) => {})
      .catch((error) => {});
  };

  const approveHandler = (id) => {
    setVisibility(null);
    setList(
      list.map((item) =>
        item._id === id
          ? {
              ...item,
              status: "approved",
            }
          : item
      )
    );

    let configAuth = {
      headers: {
        authorization: `Bearer ${getItemToLocalStorage(AuthEnum.TOKEN)}`,
      },
    };

    axios
      .put(
        `${URLconfig.SMART_PHONE_BASE_URL}/app-kyc/${id}/approved`,
        null,
        configAuth
      )
      .then((e) => {})
      .catch((error) => {});
  };

  return (
    <Box varient="div" component="div" className={classess.page}>
      <Box component="div" varient="div" className={classess.page__list}>
        <TableContainer className={classess.table}>
          <Table stickyHeader={true} aria-label="sticky table">
            <TableHead className={classess.table__head}>
              <TableRow>
                <TableCell className={classess.table__col}></TableCell>
                <TableCell className={classess.table__col}>
                  ARTIST NAME
                </TableCell>
                <TableCell className={classess.table__col}>
                  SUBMITTED ON
                </TableCell>
                <TableCell className={classess.table__col}>STATUS</TableCell>

                <TableCell className={classess.table__col}>
                  APPROVED BY
                </TableCell>
                <TableCell className={classess.table__col}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody className={classess.table__brow}>
              {list.map((row, index) => (
                <React.Fragment>
                  <>
                    <Box sx={{ m: "10px" }}></Box>

                    <TableRow key={index}>
                      <TableCell
                        className={`${classess.table__row} ${classess.table__image_container}`}
                      >
                        <img
                          className={classess.table__row__image}
                          src={row?.avatar}
                        />
                      </TableCell>

                      <TableCell
                        className={`${classess.table__row} ${classess.table__row__artist_name_container}`}
                      >
                        <span className={classess.table__row__artist_name}>
                          {row?.name}
                        </span>
                      </TableCell>

                      <TableCell className={classess.table__row}>
                        <span className={classess.table__row__submitOnText}>
                          {moment(row?.createdAt).format("MMMM DD YYYY")}
                        </span>
                      </TableCell>

                      <TableCell className={classess.table__row}>
                        <span>
                          <Chip
                            variant="outlined"
                            icon={
                              <Circle
                                sx={{
                                  fill:
                                    row?.status === "approved"
                                      ? "green"
                                      : row?.status === "pending"
                                      ? "orange"
                                      : "red",
                                  fontSize: "14px",
                                }}
                              />
                            }
                            label={row?.status}
                            sx={{
                              color: "#fff",
                              borderColor: "transparent",
                              textTransform: "capitalize",
                            }}
                          />
                        </span>
                      </TableCell>

                      <TableCell className={classess.table__row}>
                        {/* {row.user?.username} */}
                        {"Approve By"}
                      </TableCell>

                      <TableCell className={classess.table__row}>
                        {row?.status === "pending" && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <IconButton
                              style={{
                                backgroundColor: "#F831FF",
                                height: "30px",
                                width: "30px",
                              }}
                              onClick={() => handleToggle(index)}
                            >
                              <VisibilityIcon
                                style={{
                                  color: "#000",
                                  fontSize: "20px",
                                }}
                              />
                            </IconButton>

                            <IconButton
                              style={{
                                backgroundColor: "#4FB7FC",
                                height: "30px",
                                width: "30px",
                              }}
                            >
                              <CloudDownloadOutlinedIcon
                                sx={{
                                  backgroundColor: "#4FB7FC",
                                  color: "#000000",
                                  fontSize: "20px",
                                }}
                              />
                            </IconButton>

                            <IconButton
                              style={{
                                backgroundColor: "#FCB74F",
                                height: "30px",
                                width: "30px",
                              }}
                            >
                              <ScreenShareOutlinedIcon
                                sx={{
                                  backgroundColor: "#FCB74F",
                                  color: "#000000",
                                  fontSize: "20px",
                                }}
                              />
                            </IconButton>

                            <IconButton
                              style={{
                                backgroundColor: "#ff0000",
                                height: "30px",
                                width: "30px",
                              }}
                              onClick={() => rejectHandler(row?._id)}
                            >
                              <CancelOutlinedIcon
                                sx={{
                                  backgroundColor: "#ff0000",
                                  color: "#000000",
                                  fontSize: "20px",
                                }}
                              />
                            </IconButton>

                            <IconButton
                              style={{
                                backgroundColor: "#1BB86A",
                                height: "30px",
                                width: "30px",
                              }}
                              onClick={() => approveHandler(row?._id)}
                            >
                              <CheckIcon
                                sx={{
                                  backgroundColor: "#1BB86A",
                                  color: "#000",
                                  cursor: "pointer",
                                  fontSize: "20px",
                                }}
                              />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                  {visibility === index && (
                    <>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Grid
                            container
                            spacing={1}
                            sx={{ borderBottom: "0px", borderStyle: "none" }}
                          >
                            <Grid item xs>
                              <label
                                className={
                                  classess.table__bank_info_wrapper__name
                                }
                              >
                                WE8/W9 Form
                              </label>
                              <div
                                className={classess.table__bank_info_wrapper}
                              >
                                <div
                                  className={
                                    classess.table__bank_info_wrapper__box
                                  }
                                >
                                  <img
                                    src={PdfImage}
                                    className={
                                      classess.table__bank_info_wrapper__image
                                    }
                                    alt=""
                                  />
                                </div>
                              </div>
                              <Button
                                variant="contained"
                                className={
                                  classess.table__bank_info_wrapper__image__downloadbtn
                                }
                              >
                                Preview
                              </Button>
                            </Grid>

                            <Grid item xs>
                              <label
                                className={
                                  classess.table__bank_info_wrapper__name
                                }
                              >
                                ID Front
                              </label>
                              <div
                                className={classess.table__bank_info_wrapper}
                              >
                                <div
                                  className={
                                    classess.table__bank_info_wrapper__box
                                  }
                                >
                                  <img
                                    src={row?.file1_url}
                                    className={
                                      classess.table__bank_info_wrapper__image
                                    }
                                    style={{ width: "90%" }}
                                    alt=""
                                  />
                                </div>
                              </div>

                              <Button
                                variant="contained"
                                onClick={handleOpenFront}
                                className={
                                  classess.table__bank_info_wrapper__image__downloadbtn
                                }
                              >
                                Preview
                              </Button>

                              <Modal
                                open={openFront}
                                onClose={handleCloseFront}
                                sx={{}}
                              >
                                <Box
                                  style={style}
                                  component="img"
                                  alt="The house from the offer."
                                  src={row?.file1_url}
                                />
                              </Modal>
                            </Grid>

                            <Grid item xs>
                              <label
                                className={
                                  classess.table__bank_info_wrapper__name
                                }
                              >
                                ID Back
                              </label>
                              <div
                                className={classess.table__bank_info_wrapper}
                              >
                                <div
                                  className={
                                    classess.table__bank_info_wrapper__box
                                  }
                                >
                                  <img
                                    src={row?.file2_url}
                                    className={
                                      classess.table__bank_info_wrapper__image
                                    }
                                    style={{ width: "90%" }}
                                    alt=""
                                  />
                                </div>
                              </div>

                              <Button
                                variant="contained"
                                onClick={handleOpenBack}
                                className={
                                  classess.table__bank_info_wrapper__image__downloadbtn
                                }
                              >
                                Preview
                              </Button>
                              <Modal
                                open={openBack}
                                onClose={handleCloseBack}
                                sx={{}}
                              >
                                <Box
                                  style={style}
                                  component="img"
                                  alt="The house from the offer."
                                  src={row?.file2_url}
                                />
                              </Modal>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default KYCList;
