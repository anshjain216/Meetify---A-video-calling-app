import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function History() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const tk = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:3000/get_all_activity",
                    {
                        headers: {
                            Authorization: `Bearer ${tk}`
                        }
                    }
                );
                setHistory(res.data.data); // ✅ store data
            } catch (err) {
                console.error(err);
            }
        };

        fetchdata();
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f3ef] px-6 py-12">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <h1 className="text-5xl font-semibold text-gray-900">
                    Meeting <span className="text-[#f97316]">History</span>
                </h1>
                <p className="text-gray-500 mt-3 text-lg">
                    View all your previous meetings
                </p>
            </div>

            {/* Card */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">

                <table className="w-full">

                    {/* Head */}
                    <thead className="bg-[#fff7ed] text-[#f97316] text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-8 py-5 text-left">Meeting ID</th>
                            <th className="px-8 py-5 text-left">Date & Time</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-orange-100">

                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-[#fff7ed] transition duration-200"
                                >
                                    <td className="px-8 py-5 font-medium text-gray-800">
                                        {item.meetingId}
                                    </td>

                                    <td className="px-8 py-5 text-gray-600">
                                        {new Date(item.date).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="2"
                                    className="text-center py-14 text-gray-400 text-lg"
                                >
                                    No history found
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
            <button className="text-[white] border px-4 py-2 bg-[#f97316] rounded-full mt-8 ml-[780px]" onClick={()=>{
                navigate("/home");
            }}>
            Home
            </button>
        </div>
    );
}