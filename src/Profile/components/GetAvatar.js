import React from 'react';
import PropTypes from 'prop-types';
import defaultAvatar from '../images/defaultAvatar.png';
import '../stylesheets/GetAvatar.css';

class GetAvatar extends React.Component {
  constructor(props) {
    super(props);


    this.fr = new FileReader();

   
    this.myFileField = React.createRef(); 

    this.uploadImage = this.uploadImage.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  uploadImage(ev) {

    console.log('Ficheros');


    console.log('Elegir ficheros', ev.currentTarget.files);

    
    console.log('El primero de los ficheros elegidos ', ev.currentTarget.files[0]);

    if (ev.currentTarget.files.length > 0) {

      const myFile = ev.currentTarget.files[0];

      this.fr.addEventListener('load', this.getImage);

      this.fr.readAsDataURL(myFile);
    }

  }

  getImage() {

    console.log('Información', this.fr);

 
    const image = this.fr.result;

    this.props.updateAvatar(image);
  }

  render() {
    const avatar = this.props.avatar === '' ? defaultAvatar : this.props.avatar;
    return (
      <div className="get-avatar">
        <label className="get-avatar__label" type="button">
          Get avatar!
          <input
            type="file"
            ref={this.myFileField}
            className="get-avatar__upload-field"
            onChange={this.uploadImage}
          />
        </label>

        <div className="get-avatar__preview" style={{ backgroundImage: `url(${avatar})` }}></div>
      </div>
    );
  }
}

GetAvatar.propTypes = {
  avatar: PropTypes.string.isRequired,
  updateAvatar: PropTypes.func.isRequired
};

export default GetAvatar;
