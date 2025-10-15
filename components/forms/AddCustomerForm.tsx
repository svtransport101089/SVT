import React, { useState } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { addCustomer } from '../../services/googleScriptMock';
import { useToast } from '../../hooks/useToast';
import Spinner from '../ui/Spinner';

const AddCustomerForm: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !address1 || !address2) {
        addToast("Customer Name and both Address lines are required.", "error");
        return;
    }
    setIsLoading(true);
    try {
        const response = await addCustomer({
            customers_name: customerName,
            customers_address1: address1,
            customers_address2: address2
        });
        addToast(response, "success");
        setCustomerName('');
        setAddress1('');
        setAddress2('');
    } catch (error) {
        addToast("Failed to add customer.", "error");
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card title="Add New Customer">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="customerName"
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <Input
          id="address1"
          label="Address Line 1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          required
        />
        <Input
          id="address2"
          label="Address Line 2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          required
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Add Customer'}
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddCustomerForm;