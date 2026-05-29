function showEquipment(imageID)
{
  var defaultImage = document.getElementById("DefaultEquipment");
  var displayImage = document.getElementById(imageID);

  if ((defaultImage != null) && (displayImage != null))
  {
    displayImage.style.display = "inline";
    defaultImage.style.display = "none";
  }
  else
    window.alert("Default image was " + (defaultImage == null ? "not " : "") + "found.\n\"" +
      imageID + "\" was " + (displayImage == null ? "not " : "") + "found.");

  return;
}

/*********************************************************************************************/

function hideEquipment(imageID)
{
  var defaultImage = document.getElementById("DefaultEquipment");
  var displayImage = document.getElementById(imageID);

  if ((defaultImage != null) && (displayImage != null))
  {
    displayImage.style.display = "none";
    defaultImage.style.display = "inline";
  }
  else
    window.alert("Default image was " + (defaultImage == null ? "not " : "") + "found.\n\"" +
      imageID + "\" was " + (displayImage == null ? "not " : "") + "found.");

  return;
}