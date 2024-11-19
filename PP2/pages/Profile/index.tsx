import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "@/pages/components/AppVars";
import { useRouter } from "next/router";

const middleware = () => {
  const context = useContext(AppContext);
  const router = useRouter();
  if (!context?.userID) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile.</h1>
        <button
          onClick={() => router.push("/Login")}
          className="w-full py-2 px-4 rounded-md shadow outline-none"
        > Login</button>
      </div>
    )
  }
  else {
    return ProfilePage();
  }
}


const ProfilePage = () => {
  const context = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarFile, setAvatarFile] = useState<File>();

  const [newPword, setNewPword] = useState("");
  const [confirmPword, setConfirmPword] = useState("");

  const [avatarDisplay, setAvatarDisplay] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (context?.userID) {
        const response = await fetch(`/api/Profile/${context.userID}`);
        if (!response.ok) {
          console.error("Failed to fetch profile data");
          return;
        }

        const data = await response.json();
        console.log(data);

        if (data.avatar) {
          const avatarResponse = await fetch(data.avatar);
          const avatarJson = await avatarResponse.json();
          const avatarBase64 = Buffer.from(avatarJson.imageBuffer).toString(
            "base64"
          );
          setAvatarDisplay(`data:image/jpeg;base64,${avatarBase64}`);
        }

        setUsername(data.userName);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
      }
    };

    fetchProfile();
  }, [context?.userID]);

  const savePasswordPrelightCheck = () => {
    if (!newPword) {
      return false;
    }
    if (newPword !== confirmPword) {
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    const response = await fetch("/api/Profile/Update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        userName: username,
        firstName,
        lastName,
        email,
        phoneNumber,
      }),
    });

    if (response.ok) {
      alert("Profile updated!");
    } else {
      const resContent = await response.json();
      alert(`Error: ${JSON.stringify(resContent)}`);
    }
  };

  const handleUploadAvatar = async () => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile, avatarFile.name);

      const response = await fetch("/api/Profile/Avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Avatar updated!");
      } else {
        const resContent = await response.json();
        alert(`Error: ${JSON.stringify(resContent)}`);
      }
    }
  };

  const handleSavePassword = async () => {
    if (!savePasswordPrelightCheck()) {
      alert("Please ensure your passwords match and try again.");
      return;
    }

    const response = await fetch("/api/Profile/Update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ password: newPword }),
    });

    if (response.ok) {
      alert("Password updated!");
    } else {
      const resContent = await response.json();
      alert(`Error: ${JSON.stringify(resContent)}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4 mb-4">
      {avatarDisplay && (
        <img
          src={avatarDisplay}
          alt={"avatar"}
          className="w-20 h-20 rounded-full m-auto mb-3"
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <form onSubmit={handleSaveChanges} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md shadow outline-none"
        >
          Save Changes
        </button>
      </form>

      <form onSubmit={handleUploadAvatar} className="mt-10">
        <h2 className="text-1xl font-bold mb-4">Change Avatar</h2>

        <div className="mt-3">
          <label htmlFor="file" className="block text-sm font-medium">
            Upload New Avatar
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
          {avatarFile && <p>{avatarFile.name}</p>}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md shadow outline-none mt-3`}
        >
          Upload
        </button>
      </form>

      <form onSubmit={handleSavePassword} className="mt-10">
        <h2 className="text-1xl font-bold mb-4">Change Password</h2>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            value={newPword}
            onChange={(e) => setNewPword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPword}
            onChange={(e) => setConfirmPword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md shadow outline-none mt-3`}
        >
          Save Password
        </button>
      </form>
    </div>
  );
};

export default middleware;
