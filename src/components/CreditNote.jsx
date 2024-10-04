import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./credit.css";
import logo from "../components/cubexo_logo-removebg-preview.png";

const CreditNote = () => {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [state, setState] = useState("");
  const [returnFrom, setReturnFrom] = useState({
    name: "",
    address: "",
    phone: "",
    gstin: "",
    state: "",
  });
  const [shippingFrom, setShippingFrom] = useState({
    date: "",
    creditNoteNo: "",
    buyersRef: "",
  });
  const [items, setItems] = useState([
    { description: "", hsn: "", mrp: "", amount: "" },
  ]);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [total, setTotal] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [referenceNo, setReferenceNo] = useState("");

  const [invoiceData, setInvoiceData] = useState({
    date: "",
    invoiceNo: "",
    againstInvoiceDate: "",
    againstInvoiceNo: "",
  });

  const addItem = () => {
    setItems([...items, { description: "", hsn: "", mrp: "", amount: "" }]);
  };

  const handleItemChange = (index, event) => {
    const newItems = [...items];
    newItems[index][event.target.name] = event.target.value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => {
        const amount = parseFloat(item.amount) || 0;
        return total + amount;
      }, 0)
      .toFixed(2);
  };
  const removeItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const downloadPDF = () => {
    const input = document.getElementById("credit-note");
    console.log("Element found:", input); // Check if this logs the element or null

    if (!input) {
      console.error("Element not found");
      return; // Exit the function if the element is not found
    }

    // Proceed with the PDF generation
    const downloadButton = document.querySelector("#download-button");
    downloadButton.style.display = "none";

    // Hide all "Remove" buttons
    const removeButtons = document.querySelectorAll(".no-print");
    removeButtons.forEach((button) => {
      button.style.display = "none";
    });

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      const noPrintElements = document.querySelectorAll(".no-print");
      noPrintElements.forEach((element) => {
        element.style.display = "none";
      });
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("credit-note.pdf");

      noPrintElements.forEach((element) => {
        element.style.display = "block"; // Restore visibility
      });

      downloadButton.style.display = "block";
      removeButtons.forEach((button) => {
        button.style.display = "block";
      });
    });
  };

  return (
    <div className="bg-white p-8" id="credit-note">
      <div className=" p-2 border border-gray-400 ">
          <div className="flex items-center justify-between bg-[#34f8dd] p-1">
            <div className="text-center font-bold text-2xl flex-grow">Credit Note</div>
            <div className="ml-auto">
              <img
                alt="Logo"
                style={{ maxWidth: "90px", marginRight:"10px" }}
                src={logo}
              />
          </div>
        </div>

        <div className="mt-1 mb-8 flex flex-col md:flex-row justify-between">
          <div className="w-full  sm:full md:w-full lg:w-full xl:w-full border  border-gray-300">
            <table className="border-collapse   w-full">
              <thead>
                <tr className="bg-[#34f8dd] text-black">
                  <th className="border border-[#34f8dd] p-3 ">Date</th>
                  <th className="border border-[#34f8dd] p-3">Invoice No</th>
                  <th className="border border-[#34f8dd] p-3">
                    Against Invoice Date
                  </th>
                  <th className="border border-[#34f8dd] p-3">
                    Against Invoice No
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className=" p-2">
                    <input
                      type="date"
                      className="border border-gray-300 rounded p-1 w-full"
                      value={invoiceData.date}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, date: e.target.value })
                      }
                    />
                  </td>
                  <td className=" p-2">
                    <input
                      type="number"
                      className="border border-gray-300 rounded p-1 w-full"
                      value={invoiceData.invoiceNo}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          invoiceNo: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className=" p-2">
                    <input
                      type="date"
                      className="border border-gray-300 rounded p-1 w-full"
                      value={invoiceData.againstInvoiceDate}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          againstInvoiceDate: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td
                    className="border border-[#34f8dd];
 p-2"
                  >
                    <input
                      type="number"
                      className="border border-gray-300 rounded p-1 w-full "
                      value={invoiceData.againstInvoiceNo}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          againstInvoiceNo: e.target.value,
                        })
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-10">
            <div className="flex">
              <label className="block font-bold">Business Name:</label>
              <input
                type="text"
                className="border border-gray-300 ml-6 rounded p-1 w-[70%]"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div className="flex">
              <label className="block font-bold">Address:</label>
              <input
                type="text"
                className="border border-gray-300 rounded ml-10 p-1 w-[70%]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex">
              <label className="block font-bold">Phone Number:</label>
              <input
                type="number"
                className="border border-gray-300 ml-6 rounded p-1 w-[70%]"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex">
              <label className="block font-bold">GSTIN:</label>
              <input
                type="text"
                className="border border-gray-300 ml-10 rounded p-1 w-[70%]"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
              />
            </div>
            <div className="flex">
              <label className="block font-bold">State:</label>
              <input
                type="text"
                className="border border-gray-300 rounded ml-24 p-1 w-[70%]"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-3 bg-[#34f8dd]">
          <div className="font-bold p-3 text-black">
            Return From/Credit From
          </div>
          <div className="font-bold  p-3 text-black mr-[40%]">
            Shipping From{" "}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="mt-4 ">
            {["name", "address", "phone", "gstin", "state"].map((field) => (
              <div key={field} className="flex items-center mb-8">
                <label className="block font-bold mr-4">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1 w-full"
                  value={returnFrom[field]}
                  onChange={(e) =>
                    setReturnFrom({ ...returnFrom, [field]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-4 mr-[20%]">
            {["Date:", "CreditNoteNo:", "BuyersRef:"].map((field) => (
              <div key={field} className="flex items-center mb-8">
                <label className="block font-bold w-1/3 mr-4">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "date:" ? "date" : "text"}
                  className="border border-gray-300 rounded p-1 w-2/3"
                  value={shippingFrom[field]}
                  onChange={(e) =>
                    setShippingFrom({
                      ...shippingFrom,
                      [field]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-2 border-gray-400">
          <div className="">
            <div className="font-bold bg-[#34f8dd] p-3 mb-1 flex border border-gray-400">
              <div className="border-r-2 border-black text-black w-1/12 text-center">
                SN
              </div>
              <div className="border-r-2 border-black  text-black w-4/12 text-center">
                Description
              </div>
              <div className="border-r-2 border-black text-black  w-2/12 text-center">
                HSN
              </div>
              <div className="border-r-2 border-black text-black  w-2/12 text-center">
                MRP
              </div>
              <div className="border-r-2 border-black  text-black w-2/12 text-center">
                Amount
              </div>
              <div className="w-1/12 text-center text-black no-print">
                Action
              </div>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-300 py-2"
              >
                <div className="border-r-2 border-gray-400 w-1/12 text-center">
                  {index + 1}
                </div>
                <input
                  type="text"
                  name="description"
                  className="border-r-2 border-gray-300 w-4/12 p-1 text-center"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  type="text"
                  name="hsn"
                  className="border-r-2 border-gray-300 w-2/12 p-1 text-center"
                  placeholder="HSN"
                  value={item.hsn}
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  type="number"
                  name="mrp"
                  className="border-r-2 border-gray-300 w-2/12 p-1 text-center"
                  placeholder="MRP"
                  value={item.mrp}
                  onChange={(e) => handleItemChange(index, e)}
                />
                <input
                  type="number"
                  name="amount"
                  className="border-r-2 border-gray-300 w-2/12 p-1 text-center"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleItemChange(index, e)}
                />
                <button
                  className="bg-red-500 text-center text-white py-2 mx-2 w-1/12 rounded no-print"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              className="bg-[#34f8dd] ml-2 text-black py-3 px-4 rounded mt-2 no-print"
              onClick={addItem}
            >
              Add Item
            </button>
          </div>

          <div className="mt-4 flex justify-between">
            <div className="w-1/2 pr-4 border border-gray-400 rounded p-4">
              <div className="font-bold mb-3 ml-[30%]">Bank Details:</div>
              {["BankName", "AccountName", "AccountNumber", "Ifsc-Code"].map(
                (field) => (
                  <div key={field} className="mt-2">
                    <label className="block font-bold mb-2 mt-6">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300  rounded p-1 w-full"
                      value={bankDetails[field]}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                )
              )}
            </div>

            <div className="w-1/2 border border-gray-400 rounded p-4">
              <div className="mt-4">
                <label className="block font-bold mt-6 mb-3">Total:</label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1 w-full"
                  value={calculateTotal()}
                  readOnly
                />
              </div>
              <div className="mt-4">
                <label className="block font-bold mt-6 mb-3">
                  Payment Mode:
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded p-1 w-full"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block font-bold mt-6 mb-3">
                  Reference No:
                </label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-1 w-full"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            id="download-button"
            className="bg-blue-500 text-white py-2 px-4 rounded no-print "
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditNote;
