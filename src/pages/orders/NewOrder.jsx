import React, { useState, useEffect } from "react";
import { Grid, Button, TextField } from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import publicAxios from "../../utils/publicAxios";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

function NewOrder() {
  const navigate = useNavigate();
  // success message
  const notifySuccess = (message) =>
    toast.success(`${message}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  // error message
  const notifyError = (message) =>
    toast.error(`${message}`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const [servants, setServants] = useState([]);
  const [tables, setTables] = useState([]);

  const getServants = async () => {
    try {
      let res = await publicAxios.get("/servants");
      setServants(res?.data);
    } catch (error) {
      setServants([]);
    }
  };

  const getTables = async () => {
    try {
      let res = await publicAxios.get("/tables");
      setTables(res?.data);
    } catch (error) {
      setTables([]);
    }
  };

  useEffect(() => {
    getTables();
    getServants();
  }, []);

  const formSchema = Yup.object().shape({
    servant: Yup.string().trim().required("* This field is required."),
    table: Yup.string().trim().required("* This field is required."),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const addData = async (formData) => {
    formData.endDate = "";
    formData.content = [];
    formData.status = 1;
    formData.totalPrice = "";

    try {
      await publicAxios.post("/orders", formData);
      notifySuccess("Order added successfully");
      reset({
        servant: "",
        table: "",
      });
      navigate("/orders");
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid item xs={12}>
        <h2>New Order</h2>
      </Grid>
      <Grid item xs={12} sm={6}>
        <form onSubmit={handleSubmit(addData)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <InputLabel id="servant">Servant</InputLabel>

              <Controller
                name="servant"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Select
                    labelId="servant"
                    id="servant"
                    label="Servant"
                    variant="filled"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    fullWidth
                  >
                    {servants?.map((servant) => (
                      <MenuItem key={servant?.id} value={servant?.id}>
                        {servant?.name} {servant?.surname}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputLabel id="table">Table</InputLabel>

              <Controller
                name="table"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Select
                    labelId="table"
                    id="table"
                    label="Table"
                    variant="filled"
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    fullWidth
                  >
                    {tables?.map((table) => (
                      <MenuItem key={table?.id} value={table?.id}>
                        {table?.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button type="submit" variant="outlined" color="success">
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default NewOrder;
