import { h, Component } from 'preact';
import PropTypes from 'prop-types';

import Navigation from './Navigation';
import { getContentOfToken } from '../utilities';

class PersonalInfoForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      location: '',
      employment_title: '',
      employer_name: '',
    };
  }

  onSubmit() {
    const csrfToken = getContentOfToken('csrf-token');

    const { location, employer_name, employment_title } = this.state;

    fetch('/onboarding_update', {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          location,
          employer_name,
          employment_title,
        },
      }),
      credentials: 'same-origin',
    }).then(response => {
      if (response.ok) {
        const { next } = this.props;
        next();
      }
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const { prev } = this.props;
    return (
      <div className="about">
        <h1>About You!</h1>
        <form>
          <label htmlFor="location">
            Where are you located?
            <input
              type="text"
              name="location"
              id="location"
              onChange={this.handleChange}
              maxLength="60"
            />
          </label>

          <label htmlFor="employment_title">
            What is your title?
            <input
              type="text"
              name="employment_title"
              id="employment_title"
              onChange={this.handleChange}
              maxLength="60"
            />
          </label>

          <label htmlFor="employer_name">
            Where do you work?
            <input
              type="text"
              name="employer_name"
              id="employer_name"
              onChange={this.handleChange}
              maxLength="60"
            />
          </label>
        </form>
        <Navigation prev={prev} next={this.onSubmit} />
      </div>
    );
  }
}

PersonalInfoForm.propTypes = {
  prev: PropTypes.func.isRequired,
  next: PropTypes.string.isRequired,
};

export default PersonalInfoForm;
