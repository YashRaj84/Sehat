import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function DeletedUser() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-neutral flex items-center justify-center p-4">
      <Card className="p-10 max-w-md text-center shadow-2xl border-2 border-error/20 bg-surface/90 backdrop-blur-sm rounded-[2rem]">
        <div className="w-20 h-20 bg-error-container/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-error">person_off</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-on-surface mb-2">User doesn't exist</h1>
        <p className="font-sans text-on-surface-variant mb-8 text-sm">
          The account you were logged into has been deleted from the database.
        </p>
        <Button onClick={() => navigate('/login')} className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-bold py-3 flex items-center justify-center gap-2 shadow-lg">
          Go to Login Page <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Button>
      </Card>
    </div>
  );
}

export default DeletedUser;
