'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader as Loader2, Save } from 'lucide-react';

interface Settings {
  id: string;
  jpy_to_vnd_rate: number;
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rate, setRate] = useState(170);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
        setRate(data.jpy_to_vnd_rate);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (rate <= 0) {
      toast.error('Exchange rate must be greater than 0');
      return;
    }

    setSaving(true);
    try {
      if (settings) {
        const { error } = await supabase
          .from('settings')
          .update({ jpy_to_vnd_rate: rate })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([{ jpy_to_vnd_rate: rate }]);

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-8">Settings</h1>

      <Card className="max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Exchange Rate</h2>

        <div className="space-y-6">
          <div>
            <Label htmlFor="rate">JPY to VND Conversion Rate</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Set the exchange rate used for converting Japanese Yen to Vietnamese Dong
            </p>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  placeholder="170"
                  className="text-lg"
                  disabled={saving}
                  step={0.01}
                  min={0}
                />
              </div>
              <div className="text-lg font-semibold text-foreground">VND</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Example: 1 JPY = {rate} VND
            </p>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Current Rate</h3>
            <p className="text-sm text-muted-foreground">
              All prices in the system will use this rate for VND conversion.
            </p>
          </div>

          <div className="p-4 bg-secondary/10 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">Example Conversion</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 1,000 JPY = {(1000 * rate).toLocaleString()} VND</p>
              <p>• 10,000 JPY = {(10000 * rate).toLocaleString()} VND</p>
              <p>• 100,000 JPY = {(100000 * rate).toLocaleString()} VND</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Exchange Rate
              </>
            )}
          </Button>

          {settings && (
            <p className="text-xs text-muted-foreground text-center">
              Last updated: {new Date(settings.updated_at).toLocaleString()}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
