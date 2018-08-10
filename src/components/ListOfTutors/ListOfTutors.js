import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import "./ListOfTutors.css";
import StarRatingComponent from "react-star-rating-component";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from "reactstrap";

class ListOfTutors extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {
      tutors: [],
      ids: [],
      rating: 0,
      dropdownOpen: false,
      isAdmin: false,
      filterString: ""
    };
  }
  componentDidMount() {
    this.getTutors();
    this.getession();
  }
  getTutors() {
    axios.get("/api/tutors").then(res => {
      this.setState({ tutors: res.data });
      let tutorsPromises = this.state.tutors.map(tutor => {
        return axios.get(`/api/getrating/${tutor.tutor_id}`);
      });
      // console.log(tutorsPromises);
      Promise.all(tutorsPromises)
        .then(response => {
          // console.log(response);
          const tutorsWithRatings = response.map((e, i) => {
            // console.log(e.data || "NO AVERAGE");
            // return (this.state.tutors[i].rating = e.data || "no rating");
            return { ...this.state.tutors[i], rating: e.data || "no rating" };
          });
          this.setState({ tutors: tutorsWithRatings });
        })
        .catch(console.error);
    });
  }
  getession() {
    axios.get("/api/me").then(response => {
      this.setState({ isAdmin: response.data.isadmin });
      // console.log(response);
    });
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  handleChange(filter) {
    this.setState({ filterString: filter });
  }
  handleDelete(id) {
    axios.delete(`/api/tutors/${id}`).then(() => {
      this.getTutors();
    });
  }
  render() {
    let search = this.state.tutors
      .filter((e, i) => {
        console.log(e);
        return (e.first_name + " " + e.last_name)
          .toUpperCase()
          .includes(this.state.filterString.toUpperCase());
      })
      .map((e, i) => {
        console.log("EACH TUTOR!!!", e);

        return (
          <div key={i} className="each-box-tutor">
            {/* <img className="personal-img" src={e.picture} alt="img" />
            <div>
              {" "}
              <Link to={`/tutor/${e.first_name}`}>{e.first_name} </Link>
            </div>
            <div>{e.last_name} </div>
            <div>{e.location} </div>
            <div>{e.age} </div>
            <div>{e.years_experience} </div>
            <div>{e.class_subject} </div>
            <StarRatingComponent
              name="rate2"
              editing={false}
              starColor={"#F7C744"}
              renderStarIcon={() => <span>★</span>}
              starCount={5}
              value={Number(e.rating)}
            /> */}
            <aside className="profile-card">
              <header>
                {e.first_name}

                <img
                  src={e.picture}
                  // style={{ height: "200px" }}
                  height="200p"
                  width="200px"
                />

                <h1>
                  <Link to={`/tutor/${e.first_name}`}>{e.last_name} </Link>
                </h1>

                <h2 className="padding-for-list">Tutor</h2>
              </header>

              <div className="profile-bio">
                <p>Get to know me more!</p>
                <p>
                  <div>{e.location} </div>
                  <div>{e.age} </div>

                  <StarRatingComponent
                    name="rate2"
                    editing={false}
                    starColor={"#F7C744"}
                    renderStarIcon={() => <span>★</span>}
                    starCount={5}
                    value={Number(e.rating)}
                  />
                </p>
              </div>

              <ul className="profile-social-links">
                <li className="each-el-on-list">
                  <a href="https://accounts.google.com/signin/v2/sl/pwd?service=fusiontables&flowName=GlifWebSignIn&flowEntry=ServiceLogin">
                    <img src="https://image.flaticon.com/icons/png/512/281/281769.png" />
                  </a>
                </li>

                <li className="each-el-on-list">
                  <a href="https://github.com/">
                    <img src="https://image.flaticon.com/icons/svg/270/270798.svg" />
                  </a>
                </li>

                <li className="each-el-on-list">
                  {/* <img src="https://image.flaticon.com/icons/svg/33/33417.svg" /> */}
                  ${e.pricehour}
                </li>
              </ul>
            </aside>
            <div>
              {this.state.isAdmin && (
                <Button onClick={id => this.handleDelete(e.tutor_id)}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      });

    return (
      <div>
        <div className="filter">
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret color="primary">
              Filter By
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Filters</DropdownItem>
              <DropdownItem>
                <Link id="filter-text" to="/gettutorsbyage">
                  Filter By Age{" "}
                </Link>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem id="filter-text">
                <Link id="filter-text" to="/gettutorsbysubject">
                  Filter By Subject
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div className="search-tutors">
          <input
            className="search"
            placeholder="Search Tutors"
            onChange={e => this.handleChange(e.target.value)}
          />
        </div>
        <div className="box-tutors">{search}</div>
      </div>
    );
  }
}
export default ListOfTutors;
