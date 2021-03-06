import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import swal from "sweetalert2";
import "./NewTutor.css";
import ImageUploader from "../ListOfClasses/ListOfClasses";
import {
  updateFirstName,
  updateLastName,
  updateLocation,
  updateAge,
  updateYearsExperience,
  updateSubjectTutor,
  updatePicture,
  updateCoordinates
} from "../../ducks/userReducer";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import { Card, CardImg, CardText, CardBody, Button } from "reactstrap";

class NewTutor extends Component {
  constructor() {
    super();
    this.state = { auth_id: "", input: "", pricehour: 0 };
  }
  componentDidMount() {
    axios.get("/api/me").then(res => {
      this.setState({ auth_id: res.data });
    });
  }
  handelTutors(id) {
    axios
      .post("/api/newtutor", {
        first_name: this.props.first_name,
        last_name: this.props.last_name,
        location: this.props.location,
        age: this.props.age,
        years_experience: this.props.years_experience,
        class_subject: this.props.class_subject,
        picture: this.props.picture,
        coordinates: this.props.coordinates,
        auth_id: this.state.auth_id.auth_id,
        pricehour: this.state.pricehour
      })
      .then(() => {
        swal({
          title: "Welcome to TutorzWay!",
          confirmButtonText: "Thank You!"
        }).then(() => {
          this.props.history.push("/listoftutors");
        });
      });
  }
  handleSelect = location => {
    geocodeByAddress(location)
      .then(location => getLatLng(location[0]))
      .then(latLng => {
        this.props.updateCoordinates(latLng);
      })
      .catch(error => console.error("Error", error));
  };
  updatePrice(newprice) {
    this.setState({ pricehour: newprice });
  }

  render() {
    const {
      updateFirstName,
      updateLastName,
      updateAge,
      updateYearsExperience,
      updateSubjectTutor
    } = this.props;
    return (
      <div className="new-signup-page">
        <div className="centering">
          <div id="puff-in-center" className="new-tutor-input">
            <Card
              className="signup-card"
              body
              style={{
                borderColor: "#455E7A",
                padding: "0",
                width: "370px",
                borderRadius: "10px"
              }}
            >
              <div className="container">
                <CardImg
                  top
                  width="100vw"
                  src="http://blog.edmentum.com/sites/blog.edmentum.com/files/images/Personalized%20learning.jpg"
                  alt="Card image cap"
                  style={{ borderRadius: "9px 9px 0 0" }}
                />
                <div className="centered-text-over-img">New Tutor</div>
              </div>
              <div>
                <CardBody>
                  <CardText>
                    <div className="form-pos">
                      <div>
                        <div>
                          <label className="texting">First Name: </label>
                          <input
                            className="first_name"
                            onChange={e => updateFirstName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="texting">Last Name: </label>
                          <input
                            className="first_name"
                            onChange={e => updateLastName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="texting">Age: </label>
                          <input
                            type="number"
                            id="exp-width"
                            min="0"
                            className="first_name"
                            onChange={e => updateAge(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="texting">
                            Years of Experience:{" "}
                          </label>
                          <input
                            type="number"
                            className="first_namee"
                            onChange={e =>
                              updateYearsExperience(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <label className="texting">Subject: </label>
                          <input
                            id="input-sub"
                            className="first_name"
                            onChange={e => updateSubjectTutor(e.target.value)}
                          />
                        </div>
                        <div className="image-up">
                          <div>
                            <label className="texting">Picture: </label>
                          </div>

                          <div className="uploader-pos">
                            <ImageUploader />
                          </div>
                        </div>
                        <div>
                          <PlacesAutocomplete
                            value={this.props.location}
                            onChange={this.props.updateLocation}
                            onSelect={this.handleSelect}
                          >
                            {({
                              getInputProps,
                              suggestions,
                              getSuggestionItemProps,
                              loading
                            }) => (
                              <div>
                                <label className="texting">Location: </label>
                                <input
                                  id="input-subb"
                                  {...getInputProps({
                                    className: "first_name"
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                      ? "suggestion-item--active"
                                      : "suggestion-item";
                                    const style = suggestion.active
                                      ? {
                                          backgroundColor: "#fafafa",
                                          cursor: "pointer",
                                          borderWidth: "0px 0px 1px 0px"
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          cursor: "pointer",
                                          borderWidth: "0px 0px 1px 0px"
                                        };
                                    return (
                                      <div
                                        {...getSuggestionItemProps(suggestion, {
                                          className,
                                          style
                                        })}
                                      >
                                        <span>{suggestion.description}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </PlacesAutocomplete>
                        </div>
                        <div>
                          <label className="texting">Hour Rate: </label>
                          <input
                            className="first_name"
                            onChange={e => this.updatePrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="new-tutor-btn">
                      <Button
                        outline
                        color="success"
                        className="button"
                        onClick={id => this.handelTutors(id)}
                      >
                        Complete
                      </Button>
                    </div>
                  </CardText>
                </CardBody>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    first_name: state.first_name,
    last_name: state.last_name,
    location: state.location,
    age: state.age,
    years_experience: state.years_experience,
    class_subject: state.class_subject,
    picture: state.picture,
    coordinates: state.coordinates
  };
}
export default connect(
  mapStateToProps,
  {
    updateFirstName,
    updateLastName,
    updateLocation,
    updateAge,
    updateYearsExperience,
    updateSubjectTutor,
    updatePicture,
    updateCoordinates
  }
)(NewTutor);
