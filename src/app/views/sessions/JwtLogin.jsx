import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Card, Checkbox, Grid, TextField, Box, styled, useTheme, InputAdornment, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";

const FlexBox = styled(Box)(() => ({
  display: "flex"
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)"
}));

const StyledRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A2038",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 800,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center"
  },

  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const initialValues = {
  user_mail: "",
  user_password: "",
  remember: true
};

const validationSchema = Yup.object().shape({
  user_password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required!"),
  user_mail: Yup.string().email("Invalid Email address").required("Email is required!")
});

export default function JwtLogin() {
  const [error, setError] = useState(""); // State variable for error message
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.user_mail, values.user_password);
      navigate("/dashboard/default");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Invalid Email Or Password."); // Set error message
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <div className="img-wrapper">
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </div>
          </Grid>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="user_mail"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.user_mail}
                      onChange={handleChange}
                      helperText={touched.user_mail && errors.user_mail}
                      error={Boolean(errors.user_mail && touched.user_mail)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="user_password"
                      type={showPassword ? "text" : "password"} // Toggle password visibility
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.user_password}
                      onChange={handleChange}
                      helperText={touched.user_password && errors.user_password}
                      error={Boolean(errors.user_password && touched.user_password)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ mb: 1.5 }}
                    />
                    {/* <FlexBox justifyContent="space-between" alignItems="center">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />
                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>
                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox> */}
                    {error && ( // Render error message if present
                      <Paragraph color="error" sx={{ mt: 2 }}>
                        {error}
                      </Paragraph>
                    )}
                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>
                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}