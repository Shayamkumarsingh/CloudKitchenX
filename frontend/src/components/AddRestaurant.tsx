import  { useState } from 'react';
import { useAppData } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { restaurantService } from '../main';
import { BiMapPin, BiUpload } from 'react-icons/bi';


interface props {
    fetchMyRestaurant: ()=> Promise<void>;
}


const AddRestaurant = ({ fetchMyRestaurant }: props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);


    const {loadingLocation,location}=useAppData();

    const handleSubmit=async()=>{
        if(!name || !phone || !location || !image) {
            alert("Please fill all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("phone", phone);
        formData.append("latitude", String(location.latitude));
        formData.append("longitude", String(location.longitude));
        formData.append("formattedAddress", location.formattedAddress);
        formData.append("file", image);



        try{
            setSubmitting(true);
            await axios.post(`${restaurantService}/api/restaurant/new`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            toast.success("Restaurant added successfully");
            await fetchMyRestaurant();
        }catch(error : any) {
            toast.error(error.response?.data?.message || "Failed to add restaurant");
        }
        finally {
            setSubmitting(false);
        }
    };



    return <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-semibold ">Add Your Restaurant</h1>
            <input type="text" placeholder="Restaurant Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 text-sm border rounded mt-4 outline-none" />
            <textarea placeholder="Restaurant Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 text-sm border rounded mt-4 outline-none" />
            <input type="number" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded mt-4 outline-none" />
            
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm font-medium text-gray-700">
                <BiUpload className="h-5 w-5 text-red-500" />
                {image ? image.name : "Upload Restaurant Image"}
                <input type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files?.[0] || null)} />
                </label>

                <div className="flex items-start gap-3 rounded-lg border p-4">
                    <BiMapPin className="h-5 w-5 text-red-500" />
                    <div className="text-sm">{
                        loadingLocation ? "Fetching location..." : location?.formattedAddress || "Location not available"}
                </div>
                </div>
                
            <button className="w-full text-white py-2 rounded-lg font-semibold bg-[#e23744]" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Add Restaurant"}
            </button>

         
            </div>
    </div>;
};

export default AddRestaurant;